# Booking API

Lambda separada para la agenda V1 de `jonathanvaldes.com`.

## Flujo

```text
Landing
  -> Booking Lambda Function URL
  -> Google Calendar API
  -> Evento
  -> Google Meet
  -> Confirmación
```

La reunión V1 es `Diagnóstico tecnológico`, dura 30 minutos y usa `America/Santiago` como timezone base.

## Actions

La Function URL acepta `POST` JSON con dos acciones:

- `getAvailability`
- `createBooking`

No usa API Gateway, no usa DynamoDB de bookings y no mezcla lógica con `backend/lead_api/`.

## Disponibilidad

Configuración centralizada en `availability.py`:

- lunes a viernes;
- ventanas `10:00-13:00` y `15:00-18:00`;
- duración 30 minutos;
- buffer 15 minutos;
- anticipación mínima 2 horas;
- horizonte 30 días;
- timezone `America/Santiago` mediante `zoneinfo`.

Google Calendar FreeBusy es la fuente de verdad para ocupación real. La Lambda revalida el slot inmediatamente antes de crear el evento.

La revalidación reduce el riesgo de doble reserva, pero no es un lock transaccional absoluto entre `freebusy` y `events.insert`. Hardening adicional queda para una etapa futura si fuera necesario.

## OAuth offline

La V1 queda preparada para OAuth 2.0 con una cuenta Google propiedad de Jonathan y un calendario dedicado, por ejemplo `JonathanValdes.com - Diagnósticos`.

La autorización inicial para obtener `refresh_token` es un paso administrativo separado. Esta implementación no genera autorización real ni crea credenciales Google.

Scopes conceptuales:

```text
https://www.googleapis.com/auth/calendar.freebusy
https://www.googleapis.com/auth/calendar.events
```

No se requieren scopes de Drive, Gmail, profile ni Calendar completo.

## Secret esperado

La Lambda espera credenciales desde AWS Secrets Manager mediante `BOOKING_GOOGLE_SECRET_ARN`, o para pruebas controladas mediante `BOOKING_GOOGLE_OAUTH_CONFIG`.

Contenido conceptual del secreto:

```json
{
  "client_id": "...",
  "client_secret": "...",
  "refresh_token": "...",
  "calendar_id": "..."
}
```

No hay valores reales en el repo.

## Calendar y Meet

`createBooking` crea un evento con:

- título `Diagnóstico tecnológico - {Nombre}`;
- attendee cliente;
- `sendUpdates=all`;
- `conferenceDataVersion=1`;
- `conferenceData.createRequest`;
- `conferenceSolutionKey.type = "hangoutsMeet"`;
- `requestId` único para la conferencia.

Si Meet queda `pending`, la Lambda hace una comprobación corta del evento. Si sigue pendiente, responde booking OK con `meetUrl: null` y la UI indica revisar la invitación de Calendar.

## Testing

Las pruebas mockean Google y AWS. No llaman APIs reales.

```powershell
python -m unittest discover backend/tests
```

## Packaging

Desde la raíz del repo:

```powershell
python backend/booking_api/package_lambda.py
```

Crea `build/booking_api.zip`, ignorado por Git.

## No realizado

- No se crearon credenciales reales.
- No se ejecutó OAuth real.
- No se crearon eventos reales.
- No se generaron links Meet reales.
- No hubo deploy.
- No se ejecutó `terraform apply`.