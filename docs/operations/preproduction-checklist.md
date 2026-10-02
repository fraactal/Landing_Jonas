# Preproduction And Cutover Checklist

Estado: guía operacional para M25 o deploy futuro. No ejecutar apply, DNS, AWS real, Google real ni Cloudflare desde M24.

## Terraform state

Recomendación para producción: remote state seguro.

Debe contemplar:

- almacenamiento privado;
- cifrado;
- versionado;
- locking compatible con la versión Terraform usada;
- IAM mínimo;
- separación por ambiente si aplica;
- documentación de recuperación.

No crear bucket ni ejecutar `terraform init -migrate-state` en M24.

## Terraform preproduction

- [ ] Definir backend de state.
- [ ] Generar paquetes Lambda.
- [ ] Configurar variables no secretas aprobadas.
- [ ] Configurar `booking_google_secret_arn` con ARN real autorizado.
- [ ] Ejecutar `terraform init` en entorno autorizado.
- [ ] Ejecutar `terraform fmt -check`.
- [ ] Ejecutar `terraform validate`.
- [ ] Ejecutar `terraform plan`.
- [ ] Revisar que el plan no toque legacy.
- [ ] Revisar que el plan no imprima secretos.
- [ ] Obtener aprobación explícita antes de `terraform apply`.

## Packaging

Desde raíz del repo:

```powershell
python backend/lead_api/package_lambda.py
python backend/booking_api/package_lambda.py
```

No commitear ZIPs ni `build/`.

## SES / DKIM / SNS

- [ ] Terraform crea identidad SES/configuración cuando se autorice apply.
- [ ] Obtener outputs reales SES.
- [ ] Copiar registros exactos a Cloudflare.
- [ ] Esperar verificación SES.
- [ ] Revisar sandbox en `us-east-1`.
- [ ] Verificar destinatario durante pruebas si aplica.
- [ ] Solicitar production access cuando corresponda.
- [ ] Confirmar email de SNS después del apply.
- [ ] No considerar alarmas operativas antes de confirmar SNS subscription.

## Security headers y CSP objetivo

No crear CloudFront duplicado. Verificar ownership de S3, CloudFront, ACM y Cloudflare en M25.

Headers objetivo:

- `Strict-Transport-Security` cuando HTTPS esté estable;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` restrictiva;
- frame protection con CSP `frame-ancestors 'self'` o equivalente.

CSP objetivo:

- sin `unsafe-eval`;
- evitar `unsafe-inline` si el sitio puede operar con scripts propios/hash/nonce;
- `connect-src` debe incluir solo origen propio, Lead Function URL y Booking Function URL reales;
- no usar `connect-src *`.

## Endpoint config frontend

- [ ] Definir `lead-endpoint`.
- [ ] Definir `booking-endpoint`.
- [ ] No hardcodear Function URLs en `assets/js/main.js`.
- [ ] Validar que sin endpoint no se hacen requests.
- [ ] Validar mensaje honesto de indisponibilidad.

## Legal

- [ ] `/privacidad` revisada contra flujo real.
- [ ] `/terminos` revisada contra flujo real.
- [ ] Revisión jurídica si la operación escala.

## Smoke test Lead

1. Abrir landing controlada.
2. Completar formulario con datos TEST propios.
3. Confirmar POST al Lead API.
4. Confirmar HTTP 201.
5. Confirmar item en DynamoDB.
6. Confirmar notificación SES.
7. Confirmar logs `lead_created` y `lead_notification_sent` si aplica.
8. Confirmar métrica `LeadsCreated`.
9. Eliminar, archivar o marcar dato test según procedimiento aprobado.

## Smoke test Booking

1. Obtener availability.
2. Elegir slot test.
3. Crear booking test con email propio.
4. Confirmar evento Calendar.
5. Confirmar attendee.
6. Confirmar Meet o estado `pending` controlado.
7. Confirmar invitación.
8. Confirmar logs `booking_created`.
9. Confirmar métrica `BookingsCreated`.
10. Eliminar/cancelar evento de prueba.

## Negative tests controlados

- Wrong Content-Type.
- Invalid payload.
- Unknown field.
- Honeypot.
- Invalid slot.
- Already occupied slot.

No hacer load/stress test.

## Observabilidad

- [ ] CloudWatch log groups.
- [ ] Metric filters.
- [ ] Metrics.
- [ ] Dashboard.
- [ ] Alarms.
- [ ] SNS confirmed.
- [ ] `LeadsCreated`.
- [ ] `BookingsCreated`.
- [ ] Notification failures.
- [ ] Calendar failures.

## Cutover gate

Antes de publicar frontend nuevo:

- [ ] Terraform plan revisado.
- [ ] Backend desplegado con aprobación explícita.
- [ ] DynamoDB OK.
- [ ] SES verified.
- [ ] Google secret OK.
- [ ] Calendar OK.
- [ ] Booking API OK.
- [ ] SNS confirmed.
- [ ] Endpoints reales conocidos.
- [ ] Legales actualizados.
- [ ] Security headers/CSP preparados.
- [ ] Smoke tests backend OK.
- [ ] Rollback preparado.
- [ ] Legacy sigue disponible.

## Legacy coexistence

No modificar:

```text
C:\Users\Jona\Documents\Portafolio CV\LandingJonas_v3
C:\Users\Jona\Documents\Portafolio CV\LandingJonas_v3 - V1-PublicadoS3
```

Endpoint legacy conocido, solo documental, no llamar desde M24:

```text
https://w9psxxl2a7.execute-api.us-east-1.amazonaws.com/contact
```

## Observation window

No retirar legacy por una cantidad fija de días. Combinar:

- varios días de estabilidad;
- cero fallos críticos abiertos;
- leads reales/nuevos llegan correctamente;
- reservas funcionan;
- alarmas operativas;
- no tráfico legítimo legacy.

Retiro legacy requiere instrucción futura explícita.