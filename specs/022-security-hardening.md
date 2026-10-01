# Spec 022 - Security Hardening

Estado: Implementada.

Esta spec define el hardening de seguridad previo a producción/cutover para los flujos públicos de `jonathanvaldes.com`, incorporando una auditoría acotada del formulario productivo legacy actualmente publicado. No implementa cambios en frontend, backend, Terraform, AWS, DNS, Cloudflare, Google, SES ni endpoint legacy.

## 1. Objetivo

Preparar el módulo M22 de hardening antes de conectar o retirar flujos productivos.

Objetivos concretos:

- auditar el formulario productivo actual del sitio legacy;
- documentar endpoint, payload, protecciones y riesgos observables desde código local;
- comparar el legacy contra la arquitectura nueva M19/M20;
- definir controles de seguridad para Function URLs públicas, formulario, agenda, SES, DynamoDB y Google Calendar;
- definir plan de cutover seguro;
- definir criterios estrictos para retirar/deshabilitar el endpoint legacy.

## 2. Fuera de alcance

M22 spec-prep no debe:

- modificar el proyecto legacy;
- modificar el sitio productivo;
- llamar endpoints reales;
- hacer requests de prueba;
- cambiar Lambda/AWS real;
- modificar DNS o Cloudflare;
- hacer deploy;
- retirar endpoints;
- implementar hardening;
- crear credenciales;
- ejecutar Terraform contra infraestructura real;
- hacer commit.

## 3. Auditoría del formulario productivo actual

### 3.1 Ubicación legacy auditada

Proyecto legacy publicado:

```text
C:\Users\Jona\Documents\Portafolio CV\LandingJonas_v3 - V1-PublicadoS3
```

Archivos revisados de forma acotada:

- `index.html`;
- `script.js`;
- `assets/config.js`;
- `config.example.js`;
- `.env.example`;
- `infra/lambda-contact/index.mjs`;
- `infra/lambda-contact/README.md`;
- `docs/lambda-production-readiness.md`;
- `infra/terraform/main.tf`;
- `infra/terraform/variables.tf`;
- `infra/terraform/modules/contact-form/main.tf`;
- `infra/terraform/modules/contact-form/variables.tf`;
- `infra/terraform/modules/contact-form/outputs.tf`;
- `infra/terraform/environments/prod/main.tf`.

No se abrieron `terraform.tfvars`, `terraform.tfstate` ni backups de state para evitar exposición innecesaria de valores sensibles.

### 3.2 Formulario legacy

Formulario en `index.html`:

- `id="contact-form"`;
- `novalidate`;
- campos visibles: `name`, `email`, `phone`, `service`, `message`, `consent`;
- honeypot: input `company` dentro de `.form-field-honeypot`, con `tabindex="-1"`, `autocomplete="off"` y `aria-hidden="true"`.

Valores del select `service`:

- `Oportunidad laboral`;
- `Proyecto tecnológico`;
- `Consultoría técnica`;
- `Colaboración`;
- `Otro`.

### 3.3 Endpoint identificado

Endpoint visible en `assets/config.js`:

```text
https://w9psxxl2a7.execute-api.us-east-1.amazonaws.com/contact
```

Inferencia técnica:

- parece ser API Gateway HTTP API, no Lambda Function URL;
- evidencia: dominio `execute-api.us-east-1.amazonaws.com`, Terraform `aws_apigatewayv2_api`, ruta `POST /contact`, stage `$default`.

No se llamó este endpoint durante la auditoría.

### 3.4 Método y Content-Type

Frontend legacy usa:

```text
POST
Content-Type: application/json
```

La Lambda legacy acepta:

- `POST` para envío;
- `OPTIONS` para preflight;
- rechaza otros métodos con `405`.

### 3.5 Payload frontend observado

`script.js` construye internamente un payload con:

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "reason": "...",
  "message": "...",
  "company": "...",
  "consent": true,
  "source": "..."
}
```

Pero el `fetch` realmente envía solo:

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "reason": "...",
  "message": "..."
}
```

Hallazgo confirmado:

- el honeypot `company` existe en HTML y se lee en `readContactPayload`, pero no se transmite en el `fetch` actual;
- `consent` se valida en frontend, pero no se transmite al backend;
- `source` se construye en frontend, pero no se transmite al backend.

### 3.6 Respuesta esperada

Success legacy:

```json
{
  "ok": true,
  "message": "Mensaje enviado correctamente."
}
```

Errores documentados/observados en código:

- `400` validación;
- `403` origen no permitido;
- `405` método no permitido;
- `500` error de configuración o SES.

## 4. Protecciones actuales legacy

| Control | Estado | Evidencia / nota |
| --- | --- | --- |
| Validación frontend | Presente | `script.js` valida nombre, email, service, message, consent y largo de message. |
| Validación backend | Presente | `infra/lambda-contact/index.mjs` valida campos obligatorios, email, reason permitido, largos y mensaje mínimo. |
| Contrato cerrado backend | Parcialmente presente | La Lambda normaliza campos esperados, pero no rechaza explícitamente campos extra. |
| Honeypot frontend | Parcialmente presente | Existe input `company`, pero el frontend no lo envía al backend. |
| Honeypot backend | Presente en código, no efectivo con frontend actual | Backend revisa `body.company || body.honeypot`, pero el frontend productivo no envía `company`. |
| CAPTCHA / Turnstile | No encontrado | No hay integración visible. |
| Rate limiting | No encontrado | No hay WAF, throttling explícito o mecanismo app-level visible en código local. |
| CORS | Presente | API Gateway y Lambda restringen orígenes mediante `ALLOWED_ORIGINS`; no wildcard visible en código. |
| Payload limit | Parcialmente presente / no verificable | Campos se recortan por longitud, pero no se encontró límite explícito de tamaño total del body en Lambda. API Gateway impone límites propios, pero no reemplaza validación app-level. |
| Whitelist de campos | Parcialmente presente | Se validan campos usados, pero no se rechazan extras. |
| Sanitización | Presente | `sanitizeSingleLine`, `sanitizeMultiline`, sanitización de asunto. |
| Logging | Parcialmente presente | Logs de config/send error con requestId/origin/errorType; no loguea payload completo. |
| Manejo de errores | Presente | Respuestas JSON genéricas para error interno y SES. |
| Persistencia | No encontrada | README indica S3 deshabilitado; no hay DynamoDB. |
| Orden persistencia/email | No aplica | El legacy envía email directo; no persiste antes. |
| IAM mínimo | Presente en Terraform | Policy SES `ses:SendEmail` sobre identidad SES y logs sobre log group. |
| CloudWatch retention | Presente | Variable `log_retention_in_days`, default `14`. |

## 5. Riesgo de abuso del legacy

### 5.1 Hallazgos confirmados

- El endpoint público está visible en `assets/config.js`.
- El endpoint usa API Gateway HTTP API con ruta pública `POST /contact`.
- El formulario productivo no envía el honeypot al backend, por lo que el control antispam queda debilitado para tráfico originado por el frontend actual.
- No se encontró CAPTCHA, Turnstile, WAF ni rate limiting documentado en código local.
- No hay persistencia de leads antes de SES; si SES falla, el mensaje puede perderse.
- El backend legacy envía SES directamente por cada request válido.
- No se encontró rechazo explícito de campos inesperados.

### 5.2 Riesgos potenciales

- Spam automatizado si un script conoce el endpoint y envía payloads que pasan validación.
- Llamadas directas desde scripts; CORS limita navegadores, pero no impide clientes no navegador.
- Envío masivo en ausencia de rate limiting/WAF/concurrency controls visibles.
- Payload arbitrario mitigado parcialmente por sanitización y largos de campos, pero campos extra no se rechazan explícitamente.
- Abuso de SES ante alto volumen de payloads válidos.
- Costos innecesarios por invocaciones API Gateway/Lambda/SES ante spam o abuso.
- Pérdida de leads si SES falla, porque no existe persistencia previa.

### 5.3 No verificable sin AWS real

- Límites efectivos de throttling en API Gateway.
- Configuración real de `ALLOWED_ORIGINS` desplegada.
- Estado SES sandbox/production access.
- Métricas reales de invocaciones, errores o spam.
- Alarmas CloudWatch existentes.
- Configuración Cloudflare/WAF efectiva delante del endpoint.

## 6. Flujo actual de email legacy

Código responsable:

```text
infra/lambda-contact/index.mjs
```

Servicio usado:

```text
Amazon SES v2
```

Variables de entorno requeridas:

- `SES_REGION`;
- `SES_FROM_EMAIL`;
- `SES_TO_EMAIL`;
- `ALLOWED_ORIGINS`.

Remitente:

```text
process.env.SES_FROM_EMAIL
```

Destinatario:

```text
process.env.SES_TO_EMAIL
```

No se expone el valor real desde código versionado revisado. README usa como ejemplo `no-reply@jonathanvaldes.com` y `jonathan.valdes.o@gmail.com`.

Reply-To:

```text
payload.email
```

Asunto:

```text
[Nuevo contacto portafolio] {reason} - {name}
```

Campos incluidos en email:

- Nombre;
- Email;
- Teléfono;
- Motivo;
- Mensaje.

No incluye honeypot, consent, source, IP, headers completos ni adjuntos.

## 7. Comparación legacy vs nueva arquitectura M19/M20

| Aspecto | Legacy publicado | Nueva arquitectura M19/M20 |
| --- | --- | --- |
| Endpoint | API Gateway HTTP API `POST /contact` | Lambda Function URL `POST` con `action=createLead` |
| Payload | `name`, `email`, `phone`, `reason`, `message` | contrato cerrado con `action`, `name`, `company`, `email`, `phone`, `problemType`, `message`, `privacyAccepted`, `source`, `sourceContext`, `website` |
| Validación frontend | Presente | Presente en formulario nuevo |
| Validación backend | Presente | Más estricta y con contrato cerrado |
| Honeypot | Parcial; no enviado por frontend actual | `website` enviado y validado backend |
| Payload limit | No app-level explícito encontrado | `32 KB` backend |
| Campos inesperados | No rechazo explícito encontrado | rechazo de campos inesperados |
| Persistencia | No encontrada | DynamoDB antes de SES |
| Orden SES | SES directo define éxito operativo | DynamoDB define recepción; SES es notificación posterior |
| Error SES | `500`, usuario no tiene confirmación | Lead persiste; fallo SES no pierde lead |
| CORS | Presente, vía API Gateway y Lambda | Presente, vía Function URL y Lambda |
| IAM | SES + logs | DynamoDB + SES + logs con recursos específicos |
| Logging | Sanitizado básico | Sanitizado básico; debe reforzarse en M22 |
| Spam resistance | Parcial | Mejor base por honeypot efectivo, payload limit, contrato cerrado; rate limiting sigue pendiente |
| Cost protection | No rate limit visible | Pendiente M22: rate/concurrency/WAF/Cloudflare decisions |
| Privacidad | Consent frontend no enviado backend | privacyAccepted enviado y validado backend |

## 8. Plan de cutover

### Fase A - Mantener legacy funcionando

- Mantener endpoint legacy activo mientras el nuevo backend no esté desplegado.
- No retirar API Gateway/Lambda/SES legacy todavía.
- Monitorear señales de spam/costos si hay acceso operativo.
- No cambiar el sitio productivo durante la preparación de M22.

### Fase B - Desplegar y validar nuevo backend de forma controlada

- Desplegar M19/M20 en entorno controlado.
- Configurar CORS solo para orígenes previstos.
- Verificar DynamoDB `jonathanvaldes-leads`.
- Verificar SES interno.
- Confirmar que no se exponen secrets.
- Ejecutar pruebas con payloads válidos e inválidos desde entorno controlado.

### Fase C - Conectar nuevo formulario

- Configurar frontend nuevo para usar la Function URL nueva.
- Mantener legacy disponible como respaldo hasta validar flujo completo.
- No apuntar ambos formularios al mismo endpoint sin decisión explícita.

### Fase D - Validar E2E

Validar como mínimo:

- envío válido desde el formulario nuevo;
- recepción en DynamoDB;
- notificación SES a Jonathan;
- errores de validación;
- honeypot;
- CORS;
- payload grande;
- campos inesperados;
- experiencia frontend de éxito/error.

### Fase E - Retirar/deshabilitar endpoint legacy

Solo después de cumplir criterios de retiro:

- nuevo backend desplegado controladamente;
- prueba E2E exitosa;
- confirmación de recepción de leads en DynamoDB;
- confirmación de SES;
- validación del formulario nuevo;
- observación inicial sin errores críticos;
- decisión explícita de retirar legacy.

No eliminar recursos legacy sin snapshot/backup/documentación del estado final.

## 9. Criterios obligatorios para retirar endpoint legacy

El endpoint legacy NO debe retirarse antes de:

- deploy controlado del nuevo backend;
- prueba E2E exitosa;
- confirmación de recepción de leads;
- confirmación de SES;
- validación del formulario nuevo;
- verificación de CORS nuevo;
- verificación de errores de validación nuevo;
- confirmación de que no hay tráfico legítimo pendiente usando el endpoint legacy;
- instrucción explícita para retirar/deshabilitar.

## 10. Hardening general M22

M22 debe cubrir, como mínimo:

- Function URLs públicas: no tratarlas como secretas; validar todo server-side.
- CORS: restringido a dominios reales, sin wildcard productivo.
- Content-Type: aceptar solo `application/json` en endpoints JSON.
- Payload limits: mantener `32 KB` en leads y definir equivalente en booking.
- Validation: contrato cerrado, rechazo de campos inesperados, listas permitidas.
- Injection: escape en emails HTML, sanitización por destino, no stack traces.
- Logging/PII: requestId/leadId/bookingId sí; payload, email, teléfono, mensaje y tokens no.
- Error responses: genéricas, consistentes, sin detalles AWS/Google/SES.
- Rate limiting/abuse: evaluar Cloudflare, reserved concurrency y WAF solo si se justifica.
- WAF decision: documentar como evolución si Cloudflare/controles simples no bastan.
- Cloudflare role: DNS/TLS/rate/firewall, nunca reemplazo de validación backend.
- Honeypot: verificar que el frontend lo envía y backend lo valida.
- CAPTCHA/Turnstile: no inicial salvo spam persistente; preferir Turnstile si hace falta.
- Lambda concurrency/cost: evaluar límites bajos y alarmas básicas.
- CloudWatch retention: retención explícita, no indefinida.
- Secrets Manager: Google OAuth solo en secret, ARN específico, sin valores en Terraform plano.
- OAuth Google: scopes mínimos `calendar.freebusy` y `calendar.events`.
- SES: identidad verificada, DKIM/SPF/DMARC antes de madurez productiva, IAM mínimo.
- DynamoDB: persistir leads antes de SES, `PutItem` condicional, no guardar honeypot.
- Calendar constraints: revalidación antes de `events.insert`, limitación sin lock transaccional absoluto.
- SSRF: no aceptar URLs arbitrarias del cliente.
- Idempotency: booking con `clientRequestId`; lead puede evaluar futuro si aparecen duplicados.
- Double booking limitations: documentar y mantener revalidación inmediata.
- Frontend security: no secrets, no endpoint con token, no HTML inseguro con datos de usuario.
- Security headers: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- CSP: incluir `connect-src` solo hacia endpoints aprobados.
- HTTPS: obligatorio, sin mixed content.
- S3/CloudFront: bucket privado, no listar, no subir secrets/state.
- IAM review: recursos específicos y sin wildcards amplios salvo justificación.
- Terraform state: no copiar state legacy, no versionar tfvars/state/.terraform.
- Dependency security: dependencias mínimas y revisadas.
- Secret scanning: revisar antes de deploy y no imprimir secretos en reportes.
- Privacy: actualizar `/privacidad` antes de activar formulario/agenda productivos.
- Retention: definir retención de leads, logs y eventos Calendar.
- Incident response: plan para spam/costos/rotación/desactivación temporal.
- Monitoring hooks: invocaciones, 4xx/5xx, SES, DynamoDB, Google Calendar/OAuth.

## 11. Criterios de aceptación de M22 futuro

La implementación futura de M22 será aceptada si:

- incorpora la auditoría legacy en documentación;
- no retira legacy antes del cutover seguro;
- mantiene CORS restringido;
- exige Content-Type JSON;
- mantiene payload limits;
- refuerza contrato cerrado;
- verifica honeypot efectivo frontend/backend;
- define decisión Turnstile/CAPTCHA;
- define decisión WAF/Cloudflare/rate limiting;
- define protección de costos/concurrencia;
- define logs sin PII;
- revisa IAM mínimo;
- revisa secret scanning;
- documenta privacidad pendiente antes de producción;
- no ejecuta deploy ni cambios reales sin instrucción explícita.
## 12. Decisiones finales de implementación M22

M22 implementó hardening local sobre la arquitectura nueva sin desplegar ni modificar AWS real, Google real, DNS, Cloudflare o el proyecto legacy.

### 12.1 Lead API

- Mantiene Lambda Function URL pública con `POST` y `OPTIONS` para preflight cuando corresponda.
- Rechaza métodos no soportados con `405`.
- Rechaza requests de negocio sin `Content-Type: application/json` con `415 Unsupported Media Type`.
- Mantiene límite de payload `32 KB` y responde `413` si se supera.
- Mantiene contrato cerrado, validación de tipos, trim, required, maxlength, enums y `privacyAccepted === true`.
- Mantiene honeypot `website`; si llega con contenido no persiste, no envía SES y responde genéricamente.
- Mantiene DynamoDB `PAY_PER_REQUEST`, `PutItem` y `attribute_not_exists(leadId)`.
- Mantiene SES solo después de persistencia exitosa.
- El destinatario/remitente SES proviene de variables de entorno/Terraform, nunca del usuario.
- HTML de SES conserva escape explícito de datos de usuario.
- Logs permitidos: `request_id`, `lead_id`, operación y error técnico resumido; sin payload ni PII.

### 12.2 Booking API

- Mantiene Lambda separada de booking y Function URL propia.
- Rechaza métodos no soportados con `405`.
- Rechaza requests de negocio sin `Content-Type: application/json` con `415 Unsupported Media Type`.
- Aplica límite `32 KB`, contrato cerrado y honeypot `website`.
- Rechaza parámetros controlados por backend si el cliente intenta enviarlos: `calendarId`, `endAt`, duración, attendees extra, tipo de conferencia o scopes.
- Mantiene Google Calendar como fuente de verdad, con FreeBusy y revalidación inmediata antes de crear el evento.
- Documenta y conserva la limitación: la revalidación reduce carreras, pero no entrega lock/transacción atómica.
- Mantiene OAuth Google con scopes mínimos `calendar.freebusy` y `calendar.events`.
- Secrets Manager se usa mediante ARN específico; tokens y secretos no salen en responses ni logs.
- `clientRequestId` mantiene tipo string, formato restringido y largo máximo; no se afirma idempotencia durable porque no existe almacenamiento persistente de idempotency keys.

### 12.3 Terraform / IAM / abuso

- Se agregaron log groups explícitos para lead y booking con retención configurable, por defecto 14 días.
- Se reemplazó el uso de la policy administrada básica de Lambda por policies inline de logging sobre log groups concretos.
- Lead IAM queda limitado a logging, `dynamodb:PutItem` sobre la tabla concreta y `ses:SendEmail` sobre la identidad SES.
- Booking IAM queda limitado a logging y `secretsmanager:GetSecretValue` sobre el secret ARN específico.
- Se agregaron variables de reserved concurrency para lead y booking, ambas con valor conservador V1 `5`.
- CORS mantiene `https://jonathanvaldes.com` como origen productivo por defecto, sin wildcard.
- Localhost queda permitido solo por configuración no productiva; los recursos tienen precondition para evitar localhost/loopback en producción.
- CORS queda documentado como control de navegador, no como autenticación ni mitigación contra bots server-to-server.
- WAF y Turnstile/CAPTCHA quedan fuera de V1 y se activarán solo ante spam sostenido, abuso recurrente, costo anómalo o volumen alto de requests inválidos.

### 12.4 Frontend / DOM / Git

- `assets/js/main.js` evita insertar el estado del formulario con `innerHTML`; el enlace de WhatsApp se crea con APIs DOM y texto seguro.
- Se verificó que los datos de API/Calendar mostrados en slots y estados se insertan con `textContent` o creación DOM controlada.
- `.gitignore` cubre `.terraform/`, state, `.env`, tfvars, credenciales OAuth/Google locales, paquetes Lambda y caches Python.
- La búsqueda local de secretos queda como validación obligatoria antes del commit M22.

### 12.5 Security headers / CSP / CloudFront

Este repo todavía no administra el CloudFront/S3 productivo. Por lo tanto M22 no crea una distribución paralela ni una Response Headers Policy productiva.

Valores objetivo para el módulo de integración/deploy correspondiente:

- `Strict-Transport-Security` con HTTPS productivo estable;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` restrictiva;
- protección de frame mediante CSP `frame-ancestors 'self'` o equivalente;
- CSP sin `unsafe-eval` y evitando `unsafe-inline` si el hosting final permite nonces/hashes o scripts externos propios.

### 12.6 Privacidad / legacy / cutover

- `/privacidad` sigue como deuda antes de producción real conectada: debe cubrir formulario, DynamoDB, SES, AWS, Calendar, Meet, Google, finalidad y retención.
- El endpoint legacy permanece sin modificaciones.
- Legacy sigue documentado como API Gateway HTTP API con honeypot no conectado en frontend, sin persistencia y envío directo a SES.
- El endpoint legacy solo debe retirarse después de cutover validado según los criterios de esta spec.