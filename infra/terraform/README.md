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
## Observabilidad M23

M23 agrega observabilidad V1 sin cambiar el modelo serverless ni ejecutar AWS real desde el repo:

- logs sanitizados de Lead API y Booking API en CloudWatch Logs;
- 17 metric filters sobre eventos de aplicación;
- 10 métricas custom de baja cardinalidad en `JonathanValdes/Website`;
- métricas nativas de Lambda para invocations, errors, throttles y duration;
- 8 alarmas CloudWatch iniciales;
- 1 SNS topic para alertas operativas por email;
- 1 CloudWatch dashboard mínimo.

Flujo conceptual:

```text
Application -> sanitized logs -> CloudWatch Logs -> Metric Filters -> CloudWatch Metrics -> CloudWatch Alarms -> SNS -> email
```

La suscripción SNS por email requiere confirmación manual del destinatario después de `terraform apply`. Hasta confirmar la suscripción, SNS no entregará notificaciones por email. Las alarm actions se mantienen habilitadas solo cuando `environment = "production"` y `enable_alerting = true`.

### Métricas nativas usadas

- `AWS/Lambda Invocations` para Lead API y Booking API.
- `AWS/Lambda Errors` para errores no manejados.
- `AWS/Lambda Throttles` para saturación por concurrencia o protección de abuso.
- `AWS/Lambda Duration` promedio y p95 para tendencia de latencia.

DynamoDB permanece en `PAY_PER_REQUEST`; no se crean alarmas de capacidad provisionada. La señal crítica de pérdida de leads es `LeadDynamoDbWriteFailures`, derivada del log sanitizado `dynamodb_write_failed`.

### Métricas custom

Las métricas custom no usan `leadId`, `bookingId`, email, teléfono, nombre, mensaje, IP ni User-Agent como dimensión. V1 evita alta cardinalidad.

- `LeadsCreated`
- `LeadInvalidRequests`
- `LeadHoneypotTriggered`
- `LeadDynamoDbWriteFailures`
- `LeadNotificationFailures`
- `BookingsCreated`
- `BookingInvalidRequests`
- `BookingHoneypotTriggered`
- `BookingSlotUnavailable`
- `BookingCalendarAuthFailures`

### Alarmas V1

- `jonathanvaldes-lead-api-errors`: `AWS/Lambda Errors >= 1` en 5 minutos.
- `jonathanvaldes-lead-api-throttles`: `AWS/Lambda Throttles >= 3` durante 2 ventanas de 5 minutos.
- `jonathanvaldes-booking-api-errors`: `AWS/Lambda Errors >= 1` en 5 minutos.
- `jonathanvaldes-booking-api-throttles`: `AWS/Lambda Throttles >= 3` durante 2 ventanas de 5 minutos.
- `jonathanvaldes-lead-api-dynamodb-write-failures`: `LeadDynamoDbWriteFailures >= 1` en 5 minutos.
- `jonathanvaldes-lead-api-notification-failures`: `LeadNotificationFailures >= 2` en 10 minutos.
- `jonathanvaldes-booking-api-calendar-auth-failures`: `BookingCalendarAuthFailures >= 2` en 10 minutos.
- `jonathanvaldes-invalid-or-honeypot-traffic`: suma de invalid/honeypot `>= 20` en 5 minutos.

Todas usan `treat_missing_data = "notBreaching"`. Una Lambda sin tráfico no debe generar alarma. `InvocationSpike` queda dashboard-only en V1 para evitar ruido antes de tener baseline real.

### Runbook: Lead persistence failure

1. Revisar la alarma `jonathanvaldes-lead-api-dynamodb-write-failures`.
2. Abrir logs de Lead Lambda alrededor del `request_id`.
3. Revisar tabla DynamoDB `jonathanvaldes-leads` y estado regional AWS.
4. Revisar IAM `dynamodb:PutItem` sobre la tabla concreta.
5. Confirmar si hubo leads válidos no persistidos.
6. No registrar ni copiar PII a tickets o notas de incidente.

### Runbook: SES notification failure

1. Revisar la alarma `jonathanvaldes-lead-api-notification-failures`.
2. Confirmar que los leads fueron persistidos en DynamoDB; esta alarma no implica pérdida automática de leads.
3. Revisar SES identity, DKIM, sandbox/production access, remitente y destinatario.
4. Revisar logs de Lead Lambda por `request_id`/`lead_id` sin exponer contenido del lead.
5. Reprocesar manualmente desde DynamoDB solo si existe un procedimiento aprobado posterior.

### Runbook: Booking auth failure

1. Revisar la alarma `jonathanvaldes-booking-api-calendar-auth-failures`.
2. Revisar Secrets Manager y vigencia de `refresh_token`, `client_id`, `client_secret` y `calendar_id`.
3. Confirmar permisos OAuth y ownership/control real del calendario de diagnósticos.
4. Ejecutar una prueba controlada solo cuando esté autorizado.
5. No imprimir secretos ni tokens en logs.

### Runbook: Booking Calendar failure

1. Revisar logs de Booking Lambda por `booking_calendar_failed` y `request_id`.
2. Verificar estado de Calendar API/OAuth y permisos del calendario.
3. Confirmar que FreeBusy y `events.insert` funcionen en una prueba controlada autorizada.
4. Si Meet queda `pending`, no tratarlo como fallo total por sí solo.

### Runbook: Throttling

1. Revisar alarmas de throttles de Lead o Booking.
2. Comparar con `Invocations`, invalid requests y honeypot en el dashboard.
3. Distinguir tráfico legítimo de abuso antes de aumentar concurrencia.
4. Si el patrón es abuso sostenido, evaluar WAF, Turnstile o CloudFront en un módulo posterior.

### Runbook: Abuse / invalid spike

1. Revisar `jonathanvaldes-invalid-or-honeypot-traffic` y widget de failure/abuse.
2. Confirmar si el aumento proviene de honeypot, payload inválido, media type o payload grande.
3. Revisar costo Lambda/CloudWatch/SES.
4. No agregar IP, User-Agent ni payloads completos a logs sin una decisión de privacidad posterior.
5. Escalar a mitigaciones dedicadas solo si el patrón se sostiene.

### Costos y privacidad

CloudWatch puede cobrar por logs, metric filters/custom metrics, alarmas y dashboards; SNS puede cobrar por notificaciones. M23 mantiene una superficie pequeña: 17 filtros, 10 métricas custom, 8 alarmas, 1 dashboard y 1 topic SNS.

No se implementa X-Ray ni EMF en V1. No se agregan métricas legacy ni observabilidad para `/cv`. El sitio profesional anterior permanece fuera de este repo.