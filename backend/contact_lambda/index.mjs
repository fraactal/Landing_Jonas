import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// Valores del selector "Qué necesitas resolver" del formulario (sin tildes: normalizeReason las quita).
const ALLOWED_REASONS = new Set([
  "Automatizar un proceso",
  "Crear una aplicacion",
  "Conectar sistemas",
  "Trabajar con mis datos",
  "Mejorar infraestructura",
  "Mejorar calidad",
  "Mejorar monitoreo / visibilidad",
  "No estoy seguro",
  "Otro",
]);

const MAX_NAME_LENGTH = 120;
const MIN_NAME_LENGTH = 2;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 40;
const MAX_COMPANY_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

class ValidationError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

function getSesClient() {
  return new SESv2Client({ region: process.env.SES_REGION });
}

function getAllowedOrigins() {
  return String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function baseHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function corsHeaders(origin) {
  if (!origin || !getAllowedOrigins().includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };
}

function jsonResponse(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      ...baseHeaders(),
      ...corsHeaders(origin),
    },
    body: JSON.stringify(body),
  };
}

function getOrigin(event) {
  return event?.headers?.origin || event?.headers?.Origin || "";
}

function getMethod(event) {
  return event?.requestContext?.http?.method || event?.httpMethod || "POST";
}

function normalizeLineBreaks(value) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function sanitizeSingleLine(value, maxLength) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeMultiline(value, maxLength) {
  return normalizeLineBreaks(String(value ?? ""))
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function normalizeReason(value) {
  return sanitizeSingleLine(value, 120)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getReliableClientIp(event) {
  return sanitizeSingleLine(event?.requestContext?.http?.sourceIp || "", 64);
}

function parseJsonBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    const parsed = JSON.parse(event.body);
    if (!isPlainObject(parsed)) {
      throw new ValidationError("Datos de solicitud invalidos.");
    }
    return parsed;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError("Datos de solicitud invalidos.");
  }
}

function validatePayload(event) {
  const body = parseJsonBody(event);
  const fields = {};

  const payload = {
    name: sanitizeSingleLine(body.name, MAX_NAME_LENGTH),
    email: sanitizeSingleLine(body.email, MAX_EMAIL_LENGTH),
    phone: sanitizeSingleLine(body.phone, MAX_PHONE_LENGTH),
    company: sanitizeSingleLine(body.company, MAX_COMPANY_LENGTH),
    reason: normalizeReason(body.reason || body.service),
    message: sanitizeMultiline(body.message, MAX_MESSAGE_LENGTH),
    // El campo trampa es "website" (invisible). "company" es la empresa real del formulario.
    honeypot: sanitizeSingleLine(body.website || body.honeypot, 120),
    privacyAccepted: body.privacyAccepted === true,
    turnstileToken: sanitizeSingleLine(body.turnstileToken, MAX_TURNSTILE_TOKEN_LENGTH),
  };

  if (!payload.name || payload.name.length < MIN_NAME_LENGTH) {
    fields.name = "Ingresa un nombre valido.";
  }

  if (!payload.email) {
    fields.email = "Ingresa un correo electronico.";
  } else if (!validateEmail(payload.email)) {
    fields.email = "Ingresa un correo electronico valido.";
  }

  if (!payload.reason) {
    fields.reason = "Selecciona un motivo de contacto.";
  } else if (!ALLOWED_REASONS.has(payload.reason)) {
    fields.reason = "Selecciona un motivo de contacto valido.";
  }

  if (!payload.message) {
    fields.message = "Escribe un mensaje para continuar.";
  } else if (payload.message.length < MIN_MESSAGE_LENGTH) {
    fields.message = `El mensaje debe tener al menos ${MIN_MESSAGE_LENGTH} caracteres.`;
  } else if (payload.message.length > MAX_MESSAGE_LENGTH) {
    fields.message = `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.`;
  }

  if (payload.phone.length > MAX_PHONE_LENGTH) {
    fields.phone = `El telefono no puede superar los ${MAX_PHONE_LENGTH} caracteres.`;
  }

  if (!payload.privacyAccepted) {
    fields.privacyAccepted = "Debes aceptar la politica de privacidad.";
  }

  if (!payload.turnstileToken) {
    fields.turnstileToken = "Completa la verificacion de seguridad para continuar.";
  }

  if (payload.honeypot) {
    throw new ValidationError("Datos de solicitud invalidos.");
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError("Revisa los campos enviados.", fields);
  }

  return payload;
}

function sanitizeForSubject(value, maxLength) {
  return sanitizeSingleLine(value, maxLength).replace(/[<>]/g, "");
}

function buildEmailContent(payload) {
  const safeName = sanitizeForSubject(payload.name, 80);
  const safeReason = sanitizeForSubject(payload.reason, 80);
  const subject = `[Nuevo contacto landing] ${safeReason} - ${safeName}`;
  const bodyText = [
    "Nombre:",
    payload.name,
    "",
    "Email:",
    payload.email,
    "",
    "Telefono:",
    payload.phone || "No informado",
    "",
    "Empresa:",
    payload.company || "No informada",
    "",
    "Necesidad:",
    payload.reason,
    "",
    "Mensaje:",
    payload.message,
  ].join("\n");

  return { subject, bodyText };
}

async function verifyTurnstileToken(payload, event) {
  const formData = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: payload.turnstileToken,
  });

  const reliableClientIp = getReliableClientIp(event);
  if (reliableClientIp) {
    formData.set("remoteip", reliableClientIp);
  }

  let verificationResponse;

  try {
    verificationResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
  } catch (error) {
    throw new Error("Turnstile verification failed.");
  }

  let verificationData = {};

  try {
    verificationData = await verificationResponse.json();
  } catch (error) {
    throw new Error("Turnstile verification failed.");
  }

  if (!verificationResponse.ok || verificationData.success !== true) {
    throw new ValidationError("No se pudo validar la verificacion de seguridad. Intenta nuevamente.");
  }
}

async function sendNotification(payload) {
  const { subject, bodyText } = buildEmailContent(payload);
  const ses = getSesClient();

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [process.env.SES_TO_EMAIL],
      },
      ReplyToAddresses: [payload.email],
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: bodyText },
          },
        },
      },
    })
  );
}

function validateEnvironment() {
  const missing = [
    "SES_REGION",
    "SES_FROM_EMAIL",
    "SES_TO_EMAIL",
    "ALLOWED_ORIGINS",
    "TURNSTILE_SECRET_KEY",
  ].filter((key) => !String(process.env[key] || "").trim());

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(",")}`);
  }
}

function isOriginAllowed(origin) {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(origin);
}

export async function handler(event) {
  const origin = getOrigin(event);
  const method = getMethod(event);

  if (method === "OPTIONS") {
    if (!isOriginAllowed(origin)) {
      return jsonResponse(403, { ok: false, message: "Origen no permitido." }, "");
    }

    return jsonResponse(200, { ok: true, message: "Preflight OK." }, origin);
  }

  if (method !== "POST") {
    return jsonResponse(405, { ok: false, message: "Metodo no permitido." }, origin);
  }

  try {
    validateEnvironment();
  } catch (error) {
    console.error("contact_lambda_config_error", {
      message: error instanceof Error ? error.message : "unknown",
      requestId: event?.requestContext?.requestId || "unknown",
    });

    return jsonResponse(
      500,
      {
        ok: false,
        message: "No fue posible enviar el mensaje. Intenta nuevamente mas tarde.",
      },
      origin
    );
  }

  if (!isOriginAllowed(origin)) {
    return jsonResponse(403, { ok: false, message: "Origen no permitido." }, "");
  }

  try {
    const payload = validatePayload(event);

    await verifyTurnstileToken(payload, event);
    await sendNotification(payload);

    return jsonResponse(
      200,
      {
        ok: true,
        message: "Mensaje enviado correctamente.",
      },
      origin
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const body = {
        ok: false,
        message: error.message,
      };

      if (Object.keys(error.fields || {}).length > 0) {
        body.fields = error.fields;
      }

      return jsonResponse(400, body, origin);
    }

    console.error("contact_lambda_send_error", {
      requestId: event?.requestContext?.requestId || "unknown",
      origin: origin || "unknown",
      errorType: error instanceof Error ? error.name : "unknown",
    });

    return jsonResponse(
      500,
      {
        ok: false,
        message: "No fue posible enviar el mensaje. Intenta nuevamente mas tarde.",
      },
      origin
    );
  }
}
