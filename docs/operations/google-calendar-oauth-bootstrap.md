# Google Calendar OAuth Bootstrap

Estado: guía operacional. No ejecutar desde esta documentación sin aprobación explícita.

Objetivo: preparar credenciales OAuth para que Booking Lambda consulte disponibilidad y cree eventos en un calendario dedicado, sin exponer secretos en frontend, Git, logs ni Terraform state innecesariamente.

## Alcance

- Google OAuth 2.0 con cuenta Google propiedad de Jonathan.
- Calendario dedicado: `JonathanValdes.com - Diagnósticos`.
- Backend serverless en AWS Lambda.
- Secret en AWS Secrets Manager.

No cubre service accounts como estrategia principal V1. Service account queda como alternativa futura para Google Workspace administrado con domain-wide delegation correctamente configurada.

## Pasos conceptuales

1. Crear o seleccionar un Google Cloud project controlado por Jonathan.
2. Habilitar Google Calendar API.
3. Configurar OAuth consent screen con información mínima y coherente.
4. Crear OAuth client para el flujo administrativo de bootstrap.
5. Autorizar una vez con una cuenta Google propiedad de Jonathan que controle el calendario.
6. Solicitar offline access para obtener refresh token.
7. Usar únicamente scopes mínimos:

```text
https://www.googleapis.com/auth/calendar.freebusy
https://www.googleapis.com/auth/calendar.events
```

8. Crear o confirmar el calendario dedicado `JonathanValdes.com - Diagnósticos`.
9. Obtener su `calendar_id`.
10. Guardar credenciales en AWS Secrets Manager.

## Secret conceptual

```json
{
  "client_id": "...",
  "client_secret": "...",
  "refresh_token": "...",
  "calendar_id": "..."
}
```

## Reglas de seguridad

- No escribir valores reales en Git.
- No escribir valores reales en `terraform.tfvars`.
- No imprimir tokens ni secrets en logs.
- No exponer `calendar_id` ni credenciales al frontend.
- Configurar Terraform solo con el ARN específico del secret mediante `booking_google_secret_arn`.
- Rotar credenciales si se sospecha exposición.

## Validación futura

- FreeBusy responde correctamente.
- `events.insert` crea evento en el calendario dedicado.
- El cliente queda como attendee.
- Calendar envía invitación con estrategia equivalente a `sendUpdates="all"`.
- Meet se crea con `conferenceDataVersion=1` y `conferenceData.createRequest`.
- Si Meet queda `pending`, la reserva no falla automáticamente.