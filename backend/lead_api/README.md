# Lead API

Backend V1 para recibir leads del formulario de `jonathanvaldes.com` mediante AWS Lambda Function URL, persistirlos en DynamoDB y notificar internamente por Amazon SES.

## Alcance M20

Implementa localmente:

- handler Lambda Python;
- validación backend estricta;
- generación de `leadId` UUID v4;
- timestamp UTC;
- escritura en DynamoDB con `PutItem` condicional;
- notificación interna SES después de persistir;
- respuestas JSON;
- CORS restringido mediante Terraform;
- tests unitarios con `unittest`.

No implementa:

- conexión del formulario frontend mediante `fetch()`;
- email automático al cliente;
- Gmail API;
- Calendar/Meet;
- analytics;
- adjuntos/S3;
- API Gateway;
- deploy.

## Flujo

```text
Request válido
    ↓
DynamoDB PutItem
    ↓
Lead persistido
    ↓
SES SendEmail
    ↓
Notificación interna
```

El lead se considera recibido cuando DynamoDB confirma la persistencia. Si SES falla después de DynamoDB, la Lambda mantiene la respuesta pública de éxito y registra un fallo técnico sanitizado.

## Variables de entorno

- `LEADS_TABLE_NAME`: nombre de la tabla DynamoDB de leads.
- `LEAD_NOTIFICATION_TO`: destino operativo interno para notificaciones de leads. V1 usa `jonathan.valdes.o@gmail.com` mediante configuración, no como branding público.
- `LEAD_NOTIFICATION_FROM`: remitente técnico verificado en SES, por ejemplo `notificaciones@jonathanvaldes.com`.
- `ALLOWED_ORIGINS`: lista separada por coma para CORS en respuestas del handler. Producción debe usar `https://jonathanvaldes.com`.
- `ENVIRONMENT`: nombre del ambiente (`production`, `staging`, `local`, etc.).

M20 no requiere secretos.

## Contrato

Método permitido: `POST`.

Payload:

```json
{
  "action": "createLead",
  "name": "Juan Pérez",
  "company": "Empresa ABC",
  "email": "juan@empresa.cl",
  "phone": "+56...",
  "problemType": "Automatizar un proceso",
  "message": "Hoy realizamos...",
  "privacyAccepted": true,
  "source": "website",
  "sourceContext": "final-cta",
  "website": ""
}
```

`website` es honeypot y no se persiste ni se incluye en el email.

## Persistencia

Se guardan únicamente:

- `leadId`;
- `createdAt`;
- `name`;
- `company` si viene con contenido;
- `email`;
- `phone` si viene con contenido;
- `problemType`;
- `message`;
- `privacyAccepted`;
- `source`;
- `sourceContext`;
- `status`.

No se guardan headers completos, IP, User-Agent completo, cookies, tokens ni honeypot.

## Email interno

Asunto exacto:

```text
Nuevo contacto desde JonathanValdes.com
```

Se envía versión texto plano y HTML simple. El HTML escapa los valores ingresados por el usuario antes de interpolarlos.

Incluye:

- Lead ID;
- fecha/hora UTC;
- nombre;
- empresa si existe;
- email;
- teléfono si existe;
- `problemType`;
- mensaje;
- `sourceContext`.

No incluye adjuntos, imágenes, tracking pixel, headers, IP, cookies, tokens, payload crudo ni honeypot.

## Logging

Logs permitidos:

```text
lead_created request_id=... lead_id=...
lead_notification_sent request_id=... lead_id=...
lead_notification_failed request_id=... lead_id=...
```

No loggear PII: nombre, empresa, email, teléfono, mensaje, destinatario, remitente ni body de email.

## SES sandbox

SES sandbox depende de la región. En sandbox puede ser necesario verificar también el destinatario `LEAD_NOTIFICATION_TO` antes de probar envíos. Production access debe evaluarse antes de producción abierta.

M20 no envía emails reales durante validación local y no solicita production access.

## Tests locales

Desde la raíz del repo:

```powershell
python -m unittest discover -s backend/tests
```

Los tests mockean DynamoDB y SES. No ejecutan llamadas AWS reales.

## Packaging local

La infraestructura Terraform espera un zip local en `build/lead_api.zip` por defecto.

Crear el paquete sin Docker ni dependencias externas:

```powershell
python backend/lead_api/package_lambda.py
```

No ejecutar deploy ni `terraform apply` sin una spec e instrucción explícita.

## Privacidad

Antes del deploy productivo del formulario conectado, `/privacidad` debe actualizarse para reflejar tratamiento de datos, persistencia en DynamoDB y procesamiento mediante proveedores técnicos como AWS Lambda, DynamoDB y SES.