# Spec 024 - End-to-End Integration Cutover

Estado: Implementada.

Esta spec define M24 como módulo de integración End-to-End y preparación segura de cutover. La implementación de M24 deja preparado el repositorio local y la documentación operativa, sin ejecutar deploy, `terraform apply`, cambios AWS reales, Google reales, DNS, Cloudflare, retiro legacy ni M25.

## 1. Objetivo

Pasar desde componentes desarrollados localmente a un flujo completo validado sin reemplazar legacy de una sola vez. Principio rector: backend validado antes que frontend productivo, y legacy disponible hasta tener evidencia suficiente.

## 2. Arquitectura final

```text
jonathanvaldes.com
  ├─ WhatsApp
  ├─ Formulario -> Lead Function URL -> DynamoDB -> SES -> jonathan.valdes.o@gmail.com
  └─ Agenda -> Booking Function URL -> Secrets Manager -> Google OAuth -> Calendar -> Meet
```

Observabilidad:

```text
Application -> sanitized logs -> CloudWatch Logs -> Metric Filters -> Metrics -> Alarms -> SNS -> email operativo
```

Reglas: sin API Gateway nuevo en V1, sin servidor permanente, sin S3 para leads, sin adjuntos, sin secretos en frontend, sin reutilización automática de legacy.

## 3. Principio de cutover

Estrategia gradual: preparar infraestructura nueva, validar backend aislado, configurar endpoints frontend, conectar frontend nuevo, validar E2E, observar varios días con evidencia y retirar legacy solo con criterios cumplidos e instrucción explícita futura. Legacy permanece operativo durante pruebas.

## 4. Pre-check Terraform

Antes de cualquier apply futuro:

```powershell
terraform init
terraform fmt -check
terraform validate
terraform plan
```

Criterios: plan revisado, sin secretos impresos, sin tocar legacy, sin recursos inesperados. `booking_google_secret_arn` debe existir o estar aprobado. No ejecutar apply en esta spec.

## 5. Variables

Inventario requerido:

- `aws_region`: default `us-east-1`.
- `environment`: `production`, `staging`, `development` o `local`.
- `allowed_origins`: producción `https://jonathanvaldes.com`; agregar `www` solo si se usa.
- `leads_table_name`: `jonathanvaldes-leads`.
- `lambda_function_name`: `jonathanvaldes-lead-api`.
- `lambda_runtime`: default `python3.12`; revisar soporte antes de deploy.
- `lambda_package_path`: paquete Lead Lambda.
- `lead_notification_to`: `jonathan.valdes.o@gmail.com`; no exponer frontend.
- `lead_notification_from`: `notificaciones@jonathanvaldes.com`.
- `ses_domain_identity`: `jonathanvaldes.com`.
- `lambda_log_retention_days`: default `14`.
- `lead_reserved_concurrent_executions`: default `5`.
- `booking_reserved_concurrent_executions`: default `5`.
- `booking_lambda_function_name`: `jonathanvaldes-booking-api`.
- `booking_lambda_package_path`: paquete Booking Lambda.
- `booking_google_secret_arn`: ARN específico de Secrets Manager.
- `observability_namespace`: `JonathanValdes/Website`.
- `enable_alerting`: acciones activas solo en production.
- `alerts_topic_name`: `jonathanvaldes-alerts`.
- `alerts_email`: destino SNS configurable.
- `observability_dashboard_name`: `jonathanvaldes-website-v1`.
- thresholds: `lambda_error_threshold`, `throttle_threshold`, `persistence_failure_threshold`, `notification_failure_threshold`, `booking_calendar_auth_failure_threshold`, `invalid_traffic_threshold`.

No versionar `terraform.tfvars`, `.env`, credenciales Google, refresh token, client secret, state ni `.terraform/`.

## 6. Outputs

Outputs requeridos: `lead_api_function_url`, `booking_api_function_url`, `leads_table_name`, `ses_identity_domain`, `ses_domain_verification_token`, `ses_dkim_tokens`, `ses_dkim_cname_records`, `alerts_topic_arn`, `alerts_topic_name`, `observability_dashboard_name`.

Solo `lead_api_function_url` y `booking_api_function_url` se usan para frontend. No output de secretos, tokens, `calendar_id` ni emails como datos públicos.

## 7. Endpoint configuration

No hardcodear Function URLs directamente en `assets/js/main.js` si puede evitarse. Estrategia preferida: meta tags o archivo estático runtime generado en deploy.

Meta tags conceptuales:

```html
<meta name="lead-endpoint" content="https://...">
<meta name="booking-endpoint" content="https://...">
```

Archivo runtime conceptual:

```js
window.JV_LEAD_ENDPOINT = "https://...";
window.JV_BOOKING_ENDPOINT = "https://...";
```

Estado implementado: Lead y Booking contemplan `window.JV_LEAD_ENDPOINT`, `window.JV_BOOKING_ENDPOINT` o meta tags runtime equivalentes. Si no existe endpoint configurado, la UI muestra una degradación honesta sin simular éxito.

## 8. Lead integration

Flujo: `submit -> validación frontend -> POST Lead API -> sending -> 201 + ok=true -> success`.

Payload requerido: `action=createLead`, campos visibles, `privacyAccepted=true`, `source=website`, `sourceContext` permitido, honeypot `website`. No enviar campos extra.

Errores `400`, `413`, `415`, `500` y network failure muestran mensaje general y WhatsApp fallback.

## 9. Lead success UI

Mensaje exacto:

```text
Gracias. Recibimos tu mensaje y revisaremos el caso para definir el siguiente paso.
```

Mostrar solo después de HTTP `201` con `ok=true`. No mostrar si DynamoDB no confirmó persistencia. No mostrar `leadId` al usuario.

## 10. Lead error UI

Mensaje general:

```text
No pudimos enviar tu mensaje. Intenta nuevamente o contáctame por WhatsApp.
```

No exponer códigos AWS, stack traces, reglas honeypot ni detalles técnicos.

## 11. Form reset

Después de éxito real: limpiar campos, limpiar errores, restaurar botón y mantener mensaje de confirmación. Ante error: conservar datos.

## 12. Source context

Validar `source=website`. Valores permitidos de `sourceContext`: `hero`, `problem-selector`, `poc`, `final-cta`, `form`. No agregar tracking nuevo ni cookies.

## 13. Booking endpoint config

Booking debe usar el mismo mecanismo que Lead. El endpoint real vendrá de `booking_api_function_url`. CSP final debe incluirlo en `connect-src`.

## 14. Booking availability E2E

Prueba: frontend solicita `{ action: "getAvailability", website: "" }`; Booking Lambda lee Secrets Manager; renueva access token; consulta FreeBusy; calcula slots con 30 minutos, buffer 15, anticipación 2 horas y horizonte 30 días; frontend renderiza slots. No exponer `calendar_id`, tokens ni errores OAuth. No inventar slots si Google falla.

## 15. Booking create E2E

Flujo: usuario selecciona slot, frontend genera `clientRequestId`, POST `createBooking`, backend valida contrato cerrado, revalida disponibilidad, crea evento Calendar, crea Meet o maneja `pending`, agrega attendee, Calendar envía invitación con estrategia equivalente a `sendUpdates="all"`, UI muestra éxito solo si Calendar creó la reserva.

Error de slot ocupado: `Ese horario acaba de dejar de estar disponible. Selecciona otro.`

## 16. OAuth bootstrap

Procedimiento conceptual: crear/usar Google Cloud project controlado por Jonathan, habilitar Calendar API, configurar OAuth consent, crear OAuth client, autorizar una vez con cuenta Google propiedad de Jonathan, usar scopes mínimos, obtener refresh token y guardar `client_id`, `client_secret`, `refresh_token`, `calendar_id` en Secrets Manager.

Scopes:

```text
https://www.googleapis.com/auth/calendar.freebusy
https://www.googleapis.com/auth/calendar.events
```

Nunca en frontend, repo, Lambda hardcodeada ni logs.

## 17. Google Cloud

Antes de producción: identificar proyecto, habilitar Calendar API, configurar consent, crear OAuth client, autorizar cuenta de Jonathan y confirmar control real del calendario dedicado. No ejecutar en esta spec.

## 18. Refresh token

Obtener una vez, guardar en Secrets Manager, nunca versionar, nunca imprimir, nunca exponer. Rotar si se sospecha exposición.

## 19. Calendar dedicado

Crear o confirmar `JonathanValdes.com - Diagnósticos`. La cuenta autenticada debe ser propietaria o tener control real. Guardar `calendar_id` solo en secret/config backend. No aceptar `calendarId` desde frontend.

## 20. Google Meet validation

Smoke test: crear booking de prueba, confirmar evento, attendee, invitación y Meet si `success`. Si queda `pending`, confirmar evento y no fallar toda la reserva. Cancelar/eliminar evento test después. Sin polling complejo.

## 21. Secrets Manager bootstrap

Crear secret fuera del repo y, si es posible, sin guardar `secret_string` real en Terraform state. Contenido conceptual: `client_id`, `client_secret`, `refresh_token`, `calendar_id`. Configurar solo el ARN en `booking_google_secret_arn`. Verificar IAM `secretsmanager:GetSecretValue` sobre ARN específico.

## 22. SES bootstrap

Pasos: revisar outputs SES/DKIM, publicar registros exactos en Cloudflare, esperar verificación SES, confirmar DKIM, revisar SPF/DMARC según estado real, revisar sandbox en `us-east-1`, verificar destinatario si corresponde y evaluar production access. No inventar registros.

## 23. Remitente

Remitente V1: `notificaciones@jonathanvaldes.com`. Debe pertenecer a identidad SES verificada. No requiere necesariamente buzón real si el dominio está correctamente verificado.

## 24. SES destinatario

Destino operativo V1: `jonathan.valdes.o@gmail.com`. No exponer frontend ni usar como branding. Verificar si SES sandbox lo exige.

## 25. SES sandbox

Revisar si `us-east-1` está en sandbox. Si lo está, verificar destinatario o solicitar production access antes de tráfico público. No asumir estado.

## 26. SNS bootstrap

Después de deploy: confirmar topic, confirmar suscripción email manualmente, revisar alarm actions y no asumir entrega de emails antes de la confirmación. No provocar alarmas excesivas.

## 27. Privacy update

Antes de activar formulario y agenda productivos, `/privacidad` debe actualizarse para cubrir: nombre, empresa, email, teléfono opcional, `problemType`, mensaje, datos booking, AWS Lambda, DynamoDB, SES, Secrets Manager en términos generales, Google Calendar, Google Meet, finalidad de contacto/evaluación/coordinación, uso operativo, medidas razonables, logs sanitizados y retención pendiente/revisable.

Estado implementado: `/privacidad` queda actualizada para cubrir formulario, agenda, proveedores técnicos y canal WhatsApp sin exponer emails operativos internos. Puede requerir revisión jurídica antes de operación comercial definitiva.

## 28. Terms review

`/terminos` queda revisada para agenda, diagnóstico tecnológico de 30 minutos, PoC, contacto activo y ausencia de contrato automático. No convertirlo en contrato jurídico complejo.

## 29. Security headers / CSP

Antes del cutover identificar CloudFront actual, S3 actual, ACM, ownership y Response Headers Policy existente. No crear CloudFront duplicado.

Headers objetivo: HSTS cuando HTTPS esté estable, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP con `frame-ancestors`, sin `unsafe-eval`.

## 30. CSP final

`connect-src` debe incluir origen propio, Lead Function URL y Booking Function URL exactas. No usar wildcard amplio ni dominios AWS genéricos si puede evitarse.

## 31. Hosting verification

Verificar S3, CloudFront, ACM y Cloudflare DNS reales: dominio raíz, `www` si existe, bucket, certificado, redirect HTTP a HTTPS, invalidaciones, TTLs y ruta `/cv`. No asumir ciegamente.

## 32. Backend deploy order

Orden recomendado: decidir Terraform state; empaquetar Lambdas; bootstrap Google OAuth y Secrets Manager; `terraform init`, `fmt`, `validate`, `plan`; aplicar backend cuando se autorice; publicar DNS SES/DKIM; esperar verificación SES; confirmar SNS email; validar endpoints aislados; configurar frontend; publicar frontend; smoke tests E2E.

## 33. Deploy separado

Preferencia: backend antes que frontend. El frontend no debe apuntar a endpoints inexistentes.

## 34. Frontend deploy

Estrategia futura: paquete estático, inyección de endpoints, validación local, subida a S3/hosting aprobado, headers/CSP en CloudFront existente, invalidación y rollback disponible. No ejecutar en esta spec.

## 35. Smoke test Lead

Caso controlado con nombre identificable como test, email propio, `problemType=No estoy seguro`, `source=website`, `sourceContext=form`, honeypot vacío.

Validar: HTTP 201, response ok, success UI exacto, DynamoDB contiene lead, SES notifica, logs `lead_created`/`lead_notification_sent`, métrica `LeadsCreated`, sin PII en métricas. Eliminar/archivar dato test si corresponde.

## 36. Smoke test Booking

Validar disponibilidad, seleccionar slot test, crear booking con email propio, confirmar HTTP 201, evento Calendar, attendee, invitación, Meet si success, logs `booking_created`, métrica `BookingsCreated`. Eliminar/cancelar evento test después.

## 37. Negative tests

Lead: JSON inválido, campo inesperado, `problemType` inválido, `privacyAccepted=false`, honeypot con valor, payload >32 KB, content-type incorrecto.

Booking: `startAt` inválido/fuera de disponibilidad, slot ocupado, `calendarId` enviado por cliente, honeypot, content-type incorrecto, payload grande.

Sin load test agresivo y sin provocar alarmas excesivas.

## 38. Observability validation

Confirmar log groups, metric filters, custom metrics, dashboard, alarmas, SNS topic, suscripción confirmada, alarm actions en production y ausencia de PII en métricas/dimensiones/dashboards.

## 39. Legacy coexistence

Durante pruebas, legacy permanece operativo. No tocar endpoint legacy, DNS, API Gateway/Lambda legacy ni SES legacy. Si algo falla, se mantiene o restaura el flujo anterior.

## 40. Cutover

Cutover frontend solo después de backend estable, SES verificado o sandbox resuelto, Google OAuth/secret/calendar validado, SNS confirmado, privacidad actualizada, CSP listo, smoke tests exitosos y rollback documentado.

## 41. Observation criteria

Ventana: varios días de uso estable. Criterios: sin errores críticos, Lead API persiste, SES notifica o es recuperable, Booking funciona, Calendar/Meet funcionan, observability activa, sin tráfico legítimo hacia legacy y rollback disponible.

## 42. Legacy retirement criteria

Retirar legacy solo si: frontend nuevo publicado, Lead estable, DynamoDB persiste, SES notifica o tiene recuperación, Booking funciona, observability activa, SNS confirmado, legales actualizados, rollback documentado, sin tráfico legítimo al endpoint viejo e instrucción explícita futura.

## 43. Legacy retirement

Módulo futuro podrá retirar API Gateway legacy, Lambda legacy, permisos IAM, variables/config, permisos SES y referencias config legacy. No hacerlo en M24.

## 44. Rollback

Frontend: volver a versión estática anterior e invalidar CloudFront. Lead: mantener legacy o WhatsApp fallback. Booking: deshabilitar agenda y usar WhatsApp/formulario. SES: revisar DynamoDB si falla notificación. Observability: revisar CloudWatch manualmente si SNS no está confirmado.

## 45. Feature degradation

- Lead API down: error + WhatsApp.
- DynamoDB failure: no success + WhatsApp.
- SES down: lead persiste, revisión manual.
- Booking availability down: WhatsApp/formulario.
- Booking create down: error + alternativa.
- Google OAuth down: deshabilitar agenda temporalmente.
- Meet pending: confirmar booking si Calendar creó evento.
- SNS no confirmado: monitoreo manual.

## 46. Data migration

No migrar leads legacy porque legacy no persistía leads. No inventar migración.

## 47. DNS / HTTPS

No cambiar DNS mientras no sea necesario. Confirmar certificado válido, HTTPS, redirect HTTP a HTTPS, CloudFront behavior, canonical, legales por HTTPS y decisión `www`.

## 48. Terraform state

Para infraestructura productiva se recomienda backend remoto seguro. Una primera prueba podría usar state local temporal controlado, no versionado, con plan de migración.

## 49. Remote state

Si se usa remoto: S3 privado, encryption, versioning, locking compatible, IAM mínimo, separación por ambiente y documentación de recuperación. No implementar en esta spec.

## 50. CI/CD decision

M24 no requiere GitHub Actions. Dejar CI/CD formal para M25 o módulo posterior salvo necesidad explícita.

## 51. Preproduction checklist

- [ ] Repo limpio.
- [ ] Paquetes Lambda generados.
- [ ] Terraform state decidido.
- [ ] `terraform init`, `fmt`, `validate`, `plan` OK.
- [ ] `booking_google_secret_arn` configurado.
- [ ] Google Cloud project, Calendar API, OAuth consent y OAuth client listos.
- [ ] Refresh token obtenido de forma segura.
- [ ] Secret Google cargado en Secrets Manager.
- [ ] Calendario dedicado creado/verificado.
- [ ] SES identity creada.
- [ ] SES/DKIM outputs revisados y publicados en Cloudflare.
- [ ] SES verificado y sandbox revisado.
- [ ] SNS email confirmado.
- [ ] Function URLs obtenidas.
- [ ] Endpoint config frontend definido.
- [ ] CSP `connect-src` incluye endpoints reales.
- [ ] Security headers definidos en CloudFront existente.
- [ ] `/privacidad` actualizada.
- [ ] `/terminos` revisada.
- [ ] Smoke tests Lead y Booking OK.
- [ ] Negative tests controlados OK.
- [ ] CloudWatch logs, métricas, dashboard y alarmas OK.
- [ ] Rollback documentado.
- [ ] Legacy operativo durante transición.
- [ ] Retiro legacy no ejecutado.

## 52. Riesgos / deuda

OAuth bootstrap sensible, refresh token revocable, SES sandbox, propagación DNS, CSP dependiente de CloudFront real, state aún por decidir, thresholds iniciales sin baseline, sin WAF/Turnstile inicial, legales requieren actualización/revisión, legacy retirement depende de evidencia, Lead form aún debe pasar de transitorio a fetch real.

## 53. Fuera de alcance

No implementar deploy, apply, AWS real, Google OAuth real, eventos Google reales, Cloudflare DNS, retiro legacy, GitHub Actions, M25, migración inexistente, WAF/Turnstile, analytics ni API Gateway nuevo.

## 54. Implementación local M24

Implementado en repositorio:

- Configuración runtime de endpoints mediante `<meta name="lead-endpoint">`, `<meta name="booking-endpoint">`, `window.JV_LEAD_ENDPOINT` y `window.JV_BOOKING_ENDPOINT`.
- Formulario Lead conectado a `fetch` real solo cuando existe endpoint configurado; sin endpoint muestra estado honesto y alternativa WhatsApp.
- Agenda usa la misma estrategia runtime para Booking y no inventa disponibilidad si el endpoint no está configurado.
- Payloads frontend mantienen contratos cerrados de M19/M21/M22, sin secretos, tokens, `calendarId`, `duration`, attendees ni configuración Google en cliente.
- `/privacidad` y `/terminos` quedan preparados para formulario, WhatsApp, agenda, diagnóstico de 30 minutos, proveedores técnicos y PoC sin exponer emails operativos internos.
- Documentación operacional creada para OAuth/Secrets bootstrap, checklist preproducción/cutover y rollback.

No implementado ni ejecutado en M24: infraestructura real, Secrets Manager real, OAuth real, SES/DKIM/SNS real, Terraform apply, deploy frontend/backend, DNS/Cloudflare, retiro legacy, M25.
## 55. Criterios de aceptación

Spec 024 queda aprobable si: no hace cutover a ciegas; backend va antes que frontend; inventaría variables/outputs; define endpoint config; define integración Lead/Booking; documenta OAuth/Secrets/SES/SNS; exige privacidad antes de producción; revisa términos; define security headers/CSP; exige identificar hosting; define deploy order, smoke tests, negative tests, observability, coexistencia legacy, cutover, retiro, rollback, feature degradation, DNS/HTTPS, state, CI/CD decision, checklist; no ejecuta deploy; no implementa M25.