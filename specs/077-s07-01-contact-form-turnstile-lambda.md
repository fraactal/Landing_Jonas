# Spec 077 - S07.01: Formulario conectado a la Lambda de contacto con Turnstile

Estado: Implementada (pendiente de despliegue y prueba en producción).

- El formulario envía a la API existente `jonathanvaldes-contact-api` (Lambda `jonathanvaldes-contact`, SES, us-east-1) y mantiene el respaldo por WhatsApp si el envío falla.
- Se agrega el widget de Cloudflare Turnstile. El script de Cloudflare se carga solo cuando la persona empieza a usar el formulario; se pide el token antes de enviar y se reinicia después de cada intento.
- Se envía `reason` (motivo) y `turnstileToken`; el cliente acepta cualquier respuesta 2xx con `ok: true`.
- Se versiona el código de la Lambda en `backend/contact_lambda/`: nuevos motivos del formulario, empresa en el correo, aceptación de privacidad obligatoria y honeypot `website` (antes usaba `company`, que ahora es un campo real).
- Política de privacidad: se menciona Turnstile y el envío de notificaciones por correo.
- Fuera de alcance: guardar mensajes en DynamoDB (decisión: el correo es el registro por ahora).
