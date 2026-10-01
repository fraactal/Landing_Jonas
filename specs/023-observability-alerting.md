# Spec 023 - Observability Alerting

Estado: Implementada.

Esta spec define e implementa observabilidad y alertas V1 provisionables por Terraform para los flujos públicos serverless de `jonathanvaldes.com`. No ejecuta deploy, `terraform apply`, AWS real, Google real ni cambios sobre el sitio legacy.

## 1. Objetivo

Definir una capa simple de observabilidad V1 que permita responder rápidamente:

- si Lead API o Booking API están fallando;
- si aparecen throttles por reserved concurrency;
- si DynamoDB rechaza escrituras de leads;
- si SES falla después de persistir leads;
- si Google Calendar u OAuth fallan en agenda;
- si hay picos anormales de tráfico inválido o abuso;
- cuántos leads válidos y bookings se están creando.

La solución debe ser serverless, barata, operable desde AWS y proporcional al volumen inicial.

## 2. Alcance

M23 futuro podrá preparar infraestructura de observabilidad para:

- Lambda Lead API;
- Lambda Booking API;
- DynamoDB `jonathanvaldes-leads`;
- SES como notificación interna de leads;
- Google Calendar / OAuth observados desde logs de Booking Lambda;
- señales básicas de abuso;
- métricas comerciales agregadas.

No debe modificar el producto comercial ni agregar nuevas funcionalidades de captación.

## 3. Principios

- CloudWatch será la base V1.
- Separar métricas operativas y métricas de negocio.
- No introducir PII en métricas, dimensiones, dashboards ni alarm descriptions.
- Evitar dimensiones de alta cardinalidad como email, teléfono, IP, `leadId` o `bookingId`.
- Reutilizar logs/eventos existentes antes de agregar eventos duplicados.
- Alertar por señales sostenidas o críticas, no por ruido aislado.
- Mantener bajo costo: pocas métricas custom, pocas alarmas y dashboard mínimo.

## 4. Métricas operativas

Métricas operativas V1:

- Lambda invocations;
- Lambda errors;
- Lambda throttles;
- Lambda duration;
- concurrent executions cuando aporte diagnóstico;
- DynamoDB write failures desde aplicación;
- SES notification failures desde aplicación;
- Booking OAuth/auth failures;
- Calendar API failures;
- payload/content-type/validation failures agregados cuando ayuden a detectar abuso.

Preferir métricas nativas CloudWatch para Lambda y DynamoDB. Usar logs/metric filters para errores específicos de aplicación.

## 5. Métricas de negocio

Métricas de negocio V1:

- `LeadsCreated`;
- `BookingsCreated`;
- `LeadNotificationFailures` como señal operativa con impacto comercial indirecto;
- `BookingSlotUnavailable` opcional para fricción de agenda;
- `InvalidRequests` por API;
- `HoneypotTriggered` por API.

Estas métricas son agregadas. No miden comportamiento individual ni navegación de usuario.

## 6. Lead metrics

Eventos reales actuales de Lead API:

```text
lead_method_not_allowed
lead_unsupported_media_type
lead_body_decode_failed
lead_payload_too_large
lead_validation_failed
dynamodb_write_failed
lead_created
lead_notification_sent
lead_notification_failed
```

Métricas Lead recomendadas:

| Métrica | Fuente | Categoría | Nota |
| --- | --- | --- | --- |
| Lead Lambda Invocations | métrica nativa Lambda | operativa | total de invocaciones. |
| Lead Lambda Errors | métrica nativa Lambda | operativa | errores no manejados. |
| Lead Lambda Throttles | métrica nativa Lambda | operativa | efecto de reserved concurrency. |
| Lead Lambda Duration | métrica nativa Lambda | operativa | latencia técnica. |
| LeadsCreated | filter sobre `lead_created` | negocio | lead persistido correctamente. |
| LeadInvalidRequests | filter sobre `lead_validation_failed`, `lead_unsupported_media_type`, `lead_body_decode_failed`, `lead_payload_too_large` | operativa/abuso | agregado, sin payload. |
| LeadHoneypotTriggered | futuro evento explícito | abuso | M23 debe decidir si agrega log específico o si queda para M24; no loggear valor. |
| DynamoDBWriteFailures | filter sobre `dynamodb_write_failed` | crítica | puede impedir recepción de leads. |
| LeadNotificationSent | filter sobre `lead_notification_sent` | operativa | confirmación SES interna exitosa. |
| LeadNotificationFailures | filter sobre `lead_notification_failed` | warning | no significa lead perdido. |

Decisión: si M23 implementa metric filters sin cambiar código, `LeadHoneypotTriggered` puede quedar pendiente porque hoy honeypot cae bajo `lead_validation_failed`. Si se permite un cambio pequeño de logging futuro, agregar evento explícito `lead_honeypot_triggered request_id=...` sin valor del campo.

## 7. Booking metrics

Eventos reales actuales de Booking API:

```text
booking_method_not_allowed
booking_unsupported_media_type
booking_body_decode_failed
booking_payload_too_large
booking_validation_failed
booking_availability_requested
booking_slot_unavailable
booking_calendar_failed
booking_created
booking_auth_failed
```

Métricas Booking recomendadas:

| Métrica | Fuente | Categoría | Nota |
| --- | --- | --- | --- |
| Booking Lambda Invocations | métrica nativa Lambda | operativa | total de invocaciones. |
| Booking Lambda Errors | métrica nativa Lambda | operativa | errores no manejados. |
| Booking Lambda Throttles | métrica nativa Lambda | operativa | efecto de reserved concurrency. |
| Booking Lambda Duration | métrica nativa Lambda | operativa | Calendar puede elevar duración. |
| BookingAvailabilityRequests | filter sobre `booking_availability_requested` | negocio/operativa | intención de agenda. |
| BookingsCreated | filter sobre `booking_created` | negocio | reserva creada en Calendar. |
| BookingInvalidRequests | filter sobre validación/content-type/body/payload | operativa/abuso | agregado. |
| BookingHoneypotTriggered | futuro evento explícito | abuso | no loggear contenido. |
| BookingSlotUnavailable | filter sobre `booking_slot_unavailable` | negocio/operativa | fricción o carrera de disponibilidad. |
| BookingCalendarFailures | filter sobre `booking_calendar_failed` | warning/critical según volumen | Google Calendar API o create event. |
| BookingAuthFailures | filter sobre `booking_auth_failed` | critical si sostenido | OAuth/Secrets/refresh token. |
| MeetPending | futuro evento explícito opcional | operativa | solo si se observa útil; no es fallo por sí mismo. |

## 8. DynamoDB

La tabla de leads usa `PAY_PER_REQUEST`.

Métricas nativas útiles:

- `SystemErrors`;
- `UserErrors` si aparece comportamiento anómalo;
- `ThrottledRequests` si existiera;
- `ConsumedWriteCapacityUnits` solo para lectura de tendencia/costo, no alarma primaria V1.

No crear alarmas sobre capacidad provisionada porque no aplica a `PAY_PER_REQUEST`.

La señal principal para pérdida de leads es el evento de aplicación:

```text
dynamodb_write_failed
```

Esta señal tiene prioridad crítica porque puede impedir recepción del lead.

## 9. SES

SES V1 se observa principalmente desde la aplicación:

- `lead_notification_sent`;
- `lead_notification_failed`.

Decisión V1:

- no crear arquitectura compleja con SNS para bounces/complaints en M23;
- documentar bounce/complaint como mejora futura cuando el dominio SES esté verificado y exista tráfico real;
- recordar que SES sandbox/production access puede causar fallos operativos.

Una alarma de SES failure debe decir:

```text
Notificación interna fallando
```

No debe decir ni insinuar:

```text
Lead perdido
```

porque DynamoDB define la recepción del lead.

## 10. Calendar / OAuth

Google Calendar no entrega métricas nativas CloudWatch. M23 debe observarlo desde eventos sanitizados de Booking Lambda:

- `booking_auth_failed`: Secrets Manager, refresh token, client secret, OAuth o permisos;
- `booking_calendar_failed`: FreeBusy, events insert, get event, Calendar API temporalmente no disponible;
- `booking_slot_unavailable`: slot ocupado o fuera de reglas;
- `booking_created`: evento creado correctamente.

No loggear:

- refresh token;
- access token;
- client secret;
- calendar ID sensible;
- raw Google response;
- Meet URL.

## 11. Custom metrics strategy

Opciones evaluadas:

### A. Embedded Metric Format / custom metrics desde Lambda

Ventajas:

- métricas explícitas desde código;
- facilita dimensiones controladas como `Environment` y `Operation`.

Desventajas:

- requiere tocar código;
- puede aumentar costo si se emiten demasiadas métricas;
- riesgo de dimensiones accidentales o cardinalidad alta si se usa mal.

### B. CloudWatch metric filters sobre logs

Ventajas:

- aprovecha eventos sanitizados existentes;
- no requiere cambiar lógica de backend para la primera versión;
- simple, barato y suficiente para V1;
- permite alarmas básicas por patrones.

Desventajas:

- logs actuales son texto plano;
- menos expresivo que EMF;
- eventos como honeypot/Meet pending no están diferenciados todavía.

Decisión V1:

```text
Usar CloudWatch metric filters sobre logs existentes como estrategia principal.
```

EMF queda como mejora futura si las métricas crecen o se necesita mayor precisión.

## 12. Honeypot metric

Objetivo:

- `LeadHoneypotTriggered`;
- `BookingHoneypotTriggered`.

M23 debe evitar loggear el valor del honeypot.

Decisión:

- si la implementación M23 permite cambios mínimos de backend, agregar eventos sanitizados explícitos `lead_honeypot_triggered` y `booking_honeypot_triggered` antes de responder error genérico;
- si M23 se limita a Terraform/observabilidad, documentar estos eventos como deuda y usar `InvalidRequests` como proxy temporal.

Esta métrica será señal para decidir Turnstile/WAF más adelante.

## 13. Invalid requests

Invalid requests pueden venir de:

- errores reales de usuario;
- integraciones mal configuradas;
- tráfico automatizado;
- abuso.

M23 no debe clasificar bots de forma sofisticada.

Señales agregadas:

- `LeadInvalidRequests`;
- `BookingInvalidRequests`;
- `LeadUnsupportedMediaType` opcional;
- `BookingUnsupportedMediaType` opcional;
- `PayloadTooLarge` opcional si se observa abuso.

No guardar payload ni campos recibidos.

## 14. Throttles

M22 dejó reserved concurrency configurable con default V1 `5` para Lead y Booking.

Alarma V1:

- alertar si hay throttles sostenidos durante más de una ventana;
- no alertar por un único throttle aislado si no se repite.

Propuesta:

```text
Sum(Throttles) >= 3 durante 2 períodos de 5 minutos
```

Severidad: Warning, salvo que coincida con errores altos o pérdida de leads.

## 15. Error rate

Métricas nativas Lambda `Errors` capturan errores no manejados. Muchos errores de validación son respuestas manejadas y deben observarse por metric filters.

Umbral V1 propuesto:

- Lambda errors: `>= 1` durante 1 período de 5 minutos para Lead puede ser Warning/Critical según endpoint;
- Lambda errors sostenidos: `>= 3` en 2 períodos de 5 minutos es Critical;
- invalid requests: `>= 20` en 5 minutos es Warning inicial y debe ajustarse con baseline real.

No alertar por ausencia de tráfico.

## 16. Invocation spike

Como no existe baseline real, usar umbrales absolutos conservadores revisables.

Propuesta V1:

- Lead invocations `>= 100` en 5 minutos: Warning;
- Booking invocations `>= 100` en 5 minutos: Warning;
- Invalid requests `>= 20` en 5 minutos: Warning;
- Honeypot triggers `>= 5` en 5 minutos: Warning.

Estos valores no son definitivos: deben revisarse tras tráfico real.

No usar anomaly detection ni machine learning en V1.

## 17. SES alarm

Alarma propuesta:

```text
LeadNotificationFailures >= 2 en 10 minutos
```

Severidad: Warning.

Mensaje operativo:

```text
Lead persistido, pero notificación interna puede estar fallando. Revisar SES/configuración.
```

Runbook debe confirmar primero que `LeadsCreated` sigue ocurriendo y que DynamoDB está guardando.

## 18. Booking auth alarm

Alarma propuesta:

```text
BookingAuthFailures >= 2 en 10 minutos
```

Severidad: Critical si impide crear o consultar agenda.

Un fallo aislado puede quedar como log/metric sin notificación inmediata, pero fallos repetidos indican posible problema con Secrets Manager, refresh token, OAuth client o permisos del calendario.

## 19. DynamoDB criticality

Alarma propuesta:

```text
DynamoDBWriteFailures >= 1 en 5 minutos
```

Severidad: Critical.

Razón: si DynamoDB falla, el lead puede no recibirse. Esta condición tiene prioridad mayor que SES failure.

La alarma debe pedir revisar:

- logs de Lead Lambda;
- permisos IAM;
- tabla DynamoDB;
- estado regional AWS;
- si existen leads no recibidos por el usuario.

## 20. Severity

Niveles V1:

### Critical

- `DynamoDBWriteFailures >= 1` en 5 minutos;
- Lead Lambda errors sostenidos;
- Booking auth failures repetidos;
- Booking Calendar completamente fallando de forma sostenida;
- throttles combinados con errores de negocio críticos.

### Warning

- SES notification failures;
- Lambda throttles sostenidos;
- invalid request spike;
- honeypot spike;
- booking slot unavailable elevado;
- invocation spike.

No crear severidades adicionales en V1.

## 21. Alert delivery

Decisión V1:

```text
CloudWatch Alarm -> SNS Topic -> email operativo.
```

No usar:

- SMS;
- WhatsApp;
- Slack;
- PagerDuty;
- auto-remediation.

El email operativo temporal puede ser:

```text
jonathan.valdes.o@gmail.com
```

Debe quedar como variable Terraform/configuración operativa, no hardcodeado en código ni usado como branding público.

## 22. SNS

Usar un único topic parametrizado, por ejemplo:

```text
jonathanvaldes-alerts
```

Variables sugeridas para implementación futura:

- `alerts_topic_name`;
- `alerts_email`;
- `enable_alerting` si se quiere desactivar en no-producción.

Reglas:

- no crear un topic por alarma;
- no incluir PII en subject/description;
- SNS email requiere confirmación manual del destinatario;
- alarmas productivas solo deben apuntar al topic productivo.

## 23. Alarm fatigue

M23 debe priorizar 5-8 alarmas V1.

Set recomendado inicial:

1. Lead Lambda Errors;
2. Lead Lambda Throttles;
3. DynamoDB Write Failures;
4. SES Notification Failures;
5. Booking Lambda Errors;
6. Booking Lambda Throttles;
7. Booking Calendar/Auth Failures;
8. Invalid/Honeypot Traffic Spike.

Si se necesita reducir ruido, consolidar Calendar/Auth en una sola alarma warning/critical separada por severidad solo después de observar tráfico real.

## 24. Dashboard

CloudWatch Dashboard mínimo recomendado, siempre que el costo sea aceptable.

Widgets V1:

- Lead Lambda Invocations / Errors / Throttles;
- Lead Lambda Duration;
- Booking Lambda Invocations / Errors / Throttles;
- Booking Lambda Duration;
- `LeadsCreated`;
- `BookingsCreated`;
- `LeadNotificationFailures`;
- `DynamoDBWriteFailures`;
- `BookingCalendarFailures` / `BookingAuthFailures`;
- invalid/honeypot signals.

No crear dashboard enorme ni por usuario.

## 25. Costs

CloudWatch puede cobrar por:

- almacenamiento e ingesta de logs;
- metric filters/custom metrics;
- alarms;
- dashboards;
- SNS notifications.

Decisiones de costo V1:

- mantener log retention en 14 días según M22;
- pocos metric filters;
- pocas alarmas;
- un dashboard mínimo opcional;
- sin EMF masivo;
- sin dimensiones de alta cardinalidad.

## 26. Structured logging

Logs actuales son texto plano sanitizado, por ejemplo:

```text
lead_created request_id=... lead_id=...
booking_created request_id=... booking_id=...
```

Decisión V1:

- no hacer refactor grande en M23;
- metric filters pueden usar los patrones existentes;
- si M23 toca backend para honeypot explícito, mantener el mismo estilo simple;
- evaluar JSON logs como mejora futura si filtros/consultas empiezan a crecer.

JSON futuro conceptual:

```json
{
  "event": "lead_created",
  "request_id": "...",
  "lead_id": "..."
}
```

No incluir PII en logs estructurados futuros.

## 27. Correlation

Correlación V1:

- AWS request ID como correlación principal;
- `lead_id` en logs técnicos ya aprobados;
- `booking_id` en logs técnicos ya aprobados.

No enviar IDs internos innecesarios al frontend.

No usar `leadId` ni `bookingId` como metric dimensions para evitar alta cardinalidad.

## 28. X-Ray decision

Decisión V1:

```text
No implementar AWS X-Ray en M23.
```

Razones:

- arquitectura pequeña;
- costo/ruido adicional;
- CloudWatch metrics/logs son suficientes inicialmente;
- no hay tracing distribuido complejo.

X-Ray queda como opción futura si Calendar/OAuth o latencias intermitentes requieren trazabilidad más fina.

## 29. Alarm set

Alarmas recomendadas V1:

| Alarma | Fuente | Threshold inicial | Severidad |
| --- | --- | --- | --- |
| LeadLambdaErrors | AWS/Lambda Errors | `>= 1` en 5 min, revisar si genera ruido | Warning |
| LeadLambdaThrottles | AWS/Lambda Throttles | `>= 3` en 2x5 min | Warning |
| DynamoDBWriteFailures | metric filter `dynamodb_write_failed` | `>= 1` en 5 min | Critical |
| LeadNotificationFailures | metric filter `lead_notification_failed` | `>= 2` en 10 min | Warning |
| BookingLambdaErrors | AWS/Lambda Errors | `>= 1` en 5 min | Warning |
| BookingLambdaThrottles | AWS/Lambda Throttles | `>= 3` en 2x5 min | Warning |
| BookingCalendarAuthFailures | filters `booking_auth_failed` + `booking_calendar_failed` | `>= 2` en 10 min | Critical para auth, Warning/Critical para Calendar según persistencia |
| InvalidOrHoneypotSpike | invalid/honeypot filters | `>= 20 invalid` o `>= 5 honeypot` en 5 min | Warning |
| InvocationSpike | Lambda Invocations | `>= 100` en 5 min por función | Warning |

Si 9 alarmas es demasiado para V1, dejar `InvocationSpike` como dashboard-only inicialmente.

## 30. Thresholds / periods

Periodos V1:

- críticos: 5 minutos;
- warnings operativos: 5 minutos con 2 evaluation periods cuando aplique;
- SES/Auth repetidos: 10 minutos;
- abuso/spikes: 5 minutos.

Missing data:

```text
notBreaching
```

Una Lambda sin tráfico no debe generar alarma.

Todos los thresholds son iniciales y deben revisarse después de observar tráfico real.

## 31. Missing data

Tratamiento recomendado:

- `notBreaching` para métricas de errores/fallos/throttles;
- no alarmar por ausencia de `LeadsCreated` o `BookingsCreated` en V1;
- no crear alarma de “sin tráfico” mientras no exista expectativa operacional clara.

## 32. Environments

Alarmas productivas solo para `environment = production`.

Reglas:

- no enviar alertas por pruebas locales/dev;
- reutilizar `var.environment` y tags existentes;
- si se crean recursos para staging, usar topic distinto o desactivar actions;
- dashboard puede existir por ambiente, pero V1 prioriza producción.

## 33. Terraform plan

M23 futuro podrá agregar en `infra/terraform/`:

- `aws_sns_topic` para alertas;
- `aws_sns_topic_subscription` email;
- `aws_cloudwatch_log_metric_filter` para eventos de aplicación;
- `aws_cloudwatch_metric_alarm` para alarmas V1;
- `aws_cloudwatch_dashboard` mínimo opcional;
- variables de configuración de alertas;
- outputs no sensibles.

No ejecutar `terraform apply` ni conectar AWS real durante preparación/implementación local sin instrucción explícita.

## 34. Outputs

Outputs útiles no sensibles:

- `alerts_topic_arn`;
- `alerts_topic_name`;
- `observability_dashboard_name` si se crea dashboard.

No output:

- emails si se decide tratarlos como configuración operativa no pública;
- secrets;
- tokens;
- Calendar IDs sensibles.

## 35. Runbooks

### DynamoDB write failure

1. Revisar logs de Lead Lambda alrededor del `request_id`.
2. Revisar tabla DynamoDB y estado regional AWS.
3. Revisar IAM `dynamodb:PutItem`.
4. Confirmar si leads válidos están fallando.
5. Si hay pérdida de recepción, pausar conexión pública o redirigir a WhatsApp temporalmente.

### SES notification failure

1. Confirmar que `LeadsCreated` sigue aumentando.
2. Revisar SES identity, sandbox/production access y DKIM/verificación.
3. Revisar variables `LEAD_NOTIFICATION_TO` y `LEAD_NOTIFICATION_FROM`.
4. Revisar logs sin buscar PII.
5. Recuperar revisión manual desde DynamoDB si fue necesario.

### Booking auth failure

1. Revisar `BOOKING_GOOGLE_SECRET_ARN`.
2. Revisar existencia/permisos del secreto en Secrets Manager.
3. Revisar refresh token/client OAuth fuera del repo.
4. Confirmar permisos del calendario dedicado.
5. Si persiste, desactivar temporalmente agenda pública y mantener WhatsApp/formulario.

### Booking calendar failure

1. Revisar logs de Booking Lambda por `request_id`.
2. Verificar estado de Calendar API/OAuth.
3. Confirmar que FreeBusy y events insert funcionan en prueba controlada.
4. Revisar si hay cambios de permisos/calendario.

### Throttles

1. Revisar volumen de invocaciones.
2. Diferenciar tráfico legítimo de abuso.
3. Revisar reserved concurrency.
4. Ajustar concurrencia si hay demanda legítima.
5. Evaluar Turnstile/WAF/Cloudflare si es abuso.

## 36. Abuse response

Si suben invalid requests o honeypot:

1. Revisar volumen y tendencia.
2. Revisar costos Lambda/CloudWatch/SES.
3. Confirmar que requests válidos siguen funcionando.
4. Revisar origen general sin registrar PII nueva.
5. Evaluar Turnstile si el abuso pasa por navegador.
6. Evaluar WAF/Cloudflare rules si el abuso es sostenido.
7. Mantener WhatsApp como canal alternativo si se degrada formulario/agenda.

No activar CAPTCHA automáticamente en M23.

## 37. Legacy monitoring

El endpoint legacy sigue vivo hasta cutover.

Decisión V1:

```text
No invertir en instrumentación profunda del legacy dentro de M23.
```

Durante coexistencia:

- observar métricas existentes de API Gateway/Lambda si ya están disponibles en AWS;
- revisar errores/costos si hay acceso operativo;
- no modificar legacy;
- retirar/deshabilitar legacy solo después del cutover validado definido en M22.

## 38. Privacy

Observabilidad no debe ampliar tratamiento de datos personales.

Reglas:

- no PII en métricas;
- no PII en dimensions;
- no payloads en logs;
- no emails/teléfonos/nombres/mensajes en dashboards;
- mantener retención de logs en 14 días salvo decisión futura;
- actualizar `/privacidad` antes de producción real conectada si se agregan tratamientos que deban informarse.

## 39. Out of scope

M23 no implementa:

- Datadog;
- Grafana Cloud;
- Prometheus;
- OpenTelemetry completo;
- SIEM;
- X-Ray;
- analytics marketing;
- Google Analytics;
- Meta Pixel;
- session replay;
- heatmaps;
- tracing distribuido complejo;
- PagerDuty;
- Slack alerts;
- SMS;
- WhatsApp alerts;
- automatic remediation;
- monitoreo profundo del legacy;
- M24.

## 40. Risks / debt

- Logs actuales son texto plano; suficientes para filters V1, pero menos robustos que JSON.
- Honeypot no tiene evento explícito separado; puede requerir pequeño ajuste backend en M23 o quedar como deuda.
- Meet pending no tiene evento separado; puede agregarse si genera dudas operativas reales.
- Thresholds iniciales son estimaciones sin baseline productivo.
- SNS email requiere confirmación manual.
- SES bounce/complaint observability queda para una etapa posterior.
- Dashboard y custom metrics pueden generar costos pequeños pero reales.
- Sin X-Ray, troubleshooting de latencia profunda Calendar/OAuth será limitado.

## 41. Acceptance criteria

Spec 023 queda aprobable si:

- usa CloudWatch como base;
- no introduce stack externo;
- separa operational metrics y business metrics;
- no usa PII en métricas, dimensions ni dashboards;
- evita high cardinality;
- reutiliza eventos reales existentes;
- define métricas Lead y Booking;
- define DynamoDB failures como prioridad crítica;
- define SES failures sin confundirlos con pérdida de lead;
- define Booking auth/calendar failures;
- define estrategia para honeypot/invalid spikes;
- elige metric filters sobre logs como V1;
- define SNS email simple;
- no usa SMS/Slack/PagerDuty;
- considera costos;
- mantiene log retention de 14 días;
- decide no implementar X-Ray en V1;
- define alarmas útiles y thresholds iniciales;
- define treatment de missing data;
- define Terraform futuro sin ejecutar apply;
- incluye runbooks cortos;
- evita observabilidad legacy excesiva;
- no implementa M24.
## 45. Resultado implementado

M23 quedó implementada como observabilidad V1 provisionable por Terraform, sin ejecutar deploy ni `terraform apply`.

Implementación final:

- SNS topic único para alarmas operativas por email;
- suscripción email parametrizada con confirmación manual posterior;
- 17 CloudWatch log metric filters sobre logs sanitizados existentes;
- 10 métricas custom de baja cardinalidad en `JonathanValdes/Website`;
- métricas nativas Lambda para invocations, errors, throttles y duration;
- 8 alarmas iniciales con `treat_missing_data = "notBreaching"`;
- alarm actions activas solo en `production` con `enable_alerting = true`;
- CloudWatch dashboard mínimo con señales operativas, negocio, fallos y abuso;
- runbooks V1 en `infra/terraform/README.md`;
- eventos honeypot explícitos `lead_honeypot_triggered` y `booking_honeypot_triggered` sin registrar el valor del campo.

No se implementó:

- X-Ray;
- EMF;
- Slack, SMS o PagerDuty;
- WAF, Turnstile o CAPTCHA;
- SNS real ni confirmación real de email;
- AWS real, Google real, deploy ni apply;
- observabilidad para legacy `/cv`.

La observabilidad no agrega PII a métricas, dimensiones, dashboards ni descripciones de alarmas. `leadId` y `bookingId` pueden aparecer en logs operativos existentes, pero no se usan como dimensiones de CloudWatch.