# Lambda `jonathanvaldes-contact`

Recibe el formulario de contacto del landing y envía un correo con SES.

- Runtime: Node.js 20. Cuenta AWS del landing, región us-east-1. Entrada pública: API Gateway `jonathanvaldes-contact-api`.
- Verifica el token de Cloudflare Turnstile antes de enviar. No guarda los mensajes: llegan por correo.
- Variables de entorno (se configuran en la consola de Lambda; nunca van al repositorio):
  `ALLOWED_ORIGINS`, `SES_FROM_EMAIL`, `SES_REGION`, `SES_TO_EMAIL`, `TURNSTILE_SECRET_KEY`.
- `index.mjs` es el código desplegado: se pega en Lambda → Código → Deploy.
- El campo trampa (honeypot) es `website`; `company` es la empresa real del formulario.
