# Rollback Runbook

Estado: guía operacional. No automatiza rollback y no ejecuta cambios reales.

## Principios

- Mantener legacy disponible durante transición.
- No borrar datos de prueba o producción sin decisión explícita.
- No ocultar un fallo mostrando success falso.
- Degradar hacia WhatsApp/formulario cuando agenda o backend fallen.

## Frontend

Si el frontend nuevo falla:

1. Restaurar artefacto estático anterior.
2. Invalidar CloudFront cuando exista aprobación operativa.
3. Mantener endpoints nuevos sin tráfico público mientras se corrige.
4. Confirmar que WhatsApp queda disponible.

## Lead API

Si Lead API presenta problema crítico:

1. Deshabilitar o restaurar frontend anterior.
2. Usar WhatsApp como fallback visible.
3. Mantener legacy disponible durante la ventana de transición.
4. Revisar DynamoDB antes de pedir reenvío al usuario.
5. Si DynamoDB persistió el lead, no considerarlo perdido aunque SES haya fallado.

## Booking

Si Booking API, OAuth, Calendar o Meet fallan:

1. Deshabilitar/ocultar Agenda o mostrar estado de indisponibilidad.
2. Mantener WhatsApp y formulario como alternativas.
3. No borrar eventos válidos existentes por rollback frontend.
4. Revisar Google Calendar y logs sanitizados.

## SES

Si SES falla:

1. Confirmar si DynamoDB persiste leads.
2. Revisar leads manualmente desde DynamoDB si corresponde.
3. Revisar SES identity, sandbox, DKIM y variables.
4. No decir al usuario que el lead se perdió si fue persistido.

## Google

Si Google Calendar falla:

1. Degradar Agenda.
2. Mantener Lead form y WhatsApp.
3. Revisar secret, refresh token, OAuth client, calendar ID y permisos.
4. No imprimir tokens ni secretos.

## Observability

Si SNS no está confirmado:

1. No asumir alertas por email.
2. Revisar CloudWatch manualmente durante transición.
3. Confirmar suscripción SNS antes de considerar monitoreo operativo.

## Legacy retirement

No retirar legacy durante rollback. El retiro solo procede cuando el nuevo flujo esté estable, sin tráfico legítimo legacy y con instrucción futura explícita.