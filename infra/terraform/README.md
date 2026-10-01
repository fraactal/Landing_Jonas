# Terraform - Lead Capture and Booking Backend

Infraestructura para el backend V1 de leads y agenda de `jonathanvaldes.com`.

## Recursos

- DynamoDB table `jonathanvaldes-leads` en modo `PAY_PER_REQUEST`.
- IAM role para Lambda de leads.
- IAM policy mínima con `dynamodb:PutItem` sobre la tabla concreta.
- IAM policy mínima con `ses:SendEmail` sobre la identidad SES del dominio.
- Lambda Python para recepción de leads.
- Lambda Function URL de leads con `AuthType = NONE` y CORS restringido.
- SES domain identity para `jonathanvaldes.com`.
- Easy DKIM tokens para configuración DNS posterior.
- Lambda Python separada para booking/agenda.
- IAM role separado para booking.
- IAM policy mínima con `secretsmanager:GetSecretValue` sobre el secreto Google OAuth configurado.
- Lambda Function URL de booking con `AuthType = NONE` y CORS restringido.

No crea:

- API Gateway;
- Cloudflare DNS records;
- S3 para leads;
- adjuntos;
- WAF;
- CAPTCHA;
- contenido real del secreto Google OAuth;
- Calendar/Meet reales durante Terraform;
- analytics.

## Packaging

Desde la raíz del repo:

```powershell
python backend/lead_api/package_lambda.py
python backend/booking_api/package_lambda.py
```

Esto crea `build/lead_api.zip` y `build/booking_api.zip`, ignorados por Git.

## Variables

- `lead_notification_to`: destino operativo interno. V1 usa `jonathan.valdes.o@gmail.com` como configuración, no como branding público.
- `lead_notification_from`: remitente técnico SES, por defecto `notificaciones@jonathanvaldes.com`.
- `ses_domain_identity`: dominio a verificar en SES, por defecto `jonathanvaldes.com`.
- `allowed_origins`: orígenes permitidos para las Function URL.
- `booking_google_secret_arn`: ARN del secreto de AWS Secrets Manager con `client_id`, `client_secret`, `refresh_token` y `calendar_id`. Terraform no crea ni guarda el valor del secreto.
- `booking_lambda_function_name`: nombre de la Lambda de booking.
- `booking_lambda_package_path`: ruta del paquete `booking_api.zip`.

## SES y DNS

Terraform define la identidad SES del dominio y expone outputs para verificación/DKIM.

Los registros DNS deben publicarse posteriormente en Cloudflare en un paso controlado. Este módulo no modifica Cloudflare ni inventa registros manuales.

Outputs relevantes:

- `ses_identity_domain`;
- `ses_domain_verification_token`;
- `ses_dkim_tokens`;
- `ses_dkim_cname_records`.

## Booking / Google Calendar

M21 agrega una Lambda separada para agenda. La Lambda usa una Function URL independiente y espera leer credenciales OAuth desde Secrets Manager mediante `BOOKING_GOOGLE_SECRET_ARN`.

El secreto real debe crearse/cargarse fuera del repo y fuera de Terraform state con contenido conceptual:

```json
{
  "client_id": "...",
  "client_secret": "...",
  "refresh_token": "...",
  "calendar_id": "..."
}
```

Scopes OAuth documentados:

```text
https://www.googleapis.com/auth/calendar.freebusy
https://www.googleapis.com/auth/calendar.events
```

La implementación mantiene Google Calendar como fuente de verdad para reservas. No crea DynamoDB de bookings.

Output relevante:

- `booking_api_function_url`.

## SPF / DMARC

Antes de madurez productiva se debe revisar:

- DKIM;
- SPF según la configuración real de envío;
- DMARC sin aplicar una política agresiva automáticamente.

No agregar registros TXT no validados.

## SES sandbox

SES sandbox es regional. En sandbox solo se puede enviar desde y hacia identidades verificadas. El destino operativo puede requerir verificación durante pruebas, y production access debe evaluarse antes de producción abierta.

## Validación local

```powershell
terraform fmt -check
```

`terraform validate` requiere `terraform init` para descargar el provider AWS si no está inicializado. No ejecutar `terraform apply`, deploy, verificaciones SES reales, autorización OAuth real, Google Calendar real ni cambios DNS sin instrucción explícita.

## CORS

El origen productivo por defecto es:

```text
https://jonathanvaldes.com
```

Para desarrollo local, usar un archivo `terraform.tfvars` no versionado o variables de entorno, por ejemplo:

```hcl
allowed_origins = [
  "https://jonathanvaldes.com",
  "http://localhost:3000"
]
```

No usar wildcard en producción.
## Hardening M22

- Las Function URLs son públicas; CORS no es autenticación ni mitigación contra bots server-to-server.
- `allowed_origins` no permite wildcard y en `production` no debe incluir localhost ni loopback.
- Las Lambdas tienen log groups explícitos con retención configurable, por defecto 14 días.
- La concurrencia reservada es configurable por Lambda. Los valores V1 por defecto son conservadores para limitar abuso/costo sin dejar el servicio bloqueado por una única request lenta.
- IAM evita la policy administrada básica y define logging sobre log groups concretos, `dynamodb:PutItem` sobre la tabla de leads, `ses:SendEmail` sobre la identidad SES y `secretsmanager:GetSecretValue` sobre un secret ARN específico.
- No se crea WAF, CAPTCHA/Turnstile, CloudFront ni Cloudflare aquí. Esos controles quedan como escalamiento si aparecen spam sostenido, abuso recurrente, costos anómalos o volumen alto de requests inválidos.
- Security headers y CSP deben aplicarse cuando este repo administre el CloudFront/S3 productivo o durante el módulo de integración/deploy correspondiente. No se inventa infraestructura productiva paralela en M22.
- `terraform.tfstate`, `terraform.tfvars`, `.terraform/` y credenciales OAuth locales quedan fuera de Git; el state puede contener información sensible.