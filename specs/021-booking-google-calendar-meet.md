# Spec 021 - Booking Google Calendar Meet

Estado: Implementada.

Esta spec define e implementa localmente el flujo V1 para reservar un `Diagnóstico tecnológico` de 30 minutos mediante Google Calendar y Google Meet. La implementación prepara frontend, backend, Terraform y pruebas locales sin crear credenciales reales, autorización OAuth real, eventos reales, Meet real, deploy ni cambios de privacidad.

## 1. Objetivo

Definir una agenda V1 para que un visitante pueda reservar una reunión de:

```text
30 minutos
```

Nombre comercial:

```text
Diagnóstico tecnológico
```

La reunión debe servir para:

- entender el problema;
- conocer contexto;
- evaluar factibilidad;
- definir siguiente paso.

No debe presentarse como consultoría completa gratuita ni como solución técnica detallada sin evaluación previa.

## 2. Contexto

La landing ya tiene CTA `Agenda hoy mismo`, pero hoy apunta a `#contacto` y se comunica como pendiente. WhatsApp y formulario existen como canales separados. El backend actual recibe leads escritos, persiste en DynamoDB y notifica internamente por SES.

Fase 2 aprobó una arquitectura serverless para agenda basada en Lambda Function URL, Google Calendar API, Google Meet, DynamoDB y SES cuando corresponda. M21 debe definir el flujo de agenda antes de implementarlo.

## 3. Arquitectura

Arquitectura conceptual:

```text
Landing
  ↓
Agenda UI
  ↓
Disponibilidad
  ↓
Booking backend
  ↓
Google Calendar API
  ↓
Evento
  ↓
Google Meet
  ↓
Confirmación
```

La V1 debe seguir siendo serverless:

- frontend estático;
- backend en Lambda Function URL;
- Google Calendar como fuente de verdad para disponibilidad/conflictos;
- Google Meet generado desde el evento;
- sin servidor permanente;
- sin Calendly externo;
- sin pagos.

## 4. CTA Agenda

CTA existente:

```text
Agenda hoy mismo
```

Debe seguir separado de WhatsApp y del formulario. En la implementación futura, el CTA puede abrir el flujo de agenda, pero M21 no lo conecta todavía.

Reglas futuras:

- no reemplazar WhatsApp;
- no convertir Agenda en formulario escrito;
- no prometer consultoría completa gratuita;
- mantener el nombre `Diagnóstico tecnológico`.

## 5. Duración

Duración fija V1:

```text
30 minutos
```

No permitir seleccionar múltiples duraciones en V1.

Razones:

- simplifica disponibilidad;
- reduce fricción;
- coincide con el objetivo de diagnóstico inicial;
- evita convertir la agenda en un producto de consultoría.

## 6. Timezone

Timezone base de Jonathan:

```text
America/Santiago
```

Reglas:

- operar internamente timestamps en UTC;
- guardar/enviar `startAt` y `endAt` en ISO UTC;
- calcular disponibilidad usando `America/Santiago` como zona operativa base;
- no hardcodear offsets como `-03:00` porque Chile tiene daylight saving;
- usar librerías/runtime con soporte IANA timezone cuando se implemente;
- mostrar horarios al usuario en su timezone local cuando sea posible;
- mostrar siempre una referencia clara, por ejemplo `Hora de Chile (America/Santiago)` si no se detecta timezone local con confianza.

Usuarios en Chile: verán horarios en America/Santiago o su timezone local equivalente.

Usuarios internacionales: la UI futura debe indicar si el horario mostrado está en su hora local o en hora de Chile, evitando ambigüedad.

## 7. Disponibilidad

Disponibilidad inicial propuesta:

```text
Lunes a viernes
10:00-13:00 y 15:00-18:00
America/Santiago
```

Esta disponibilidad debe ser configurable, no hardcodeada de forma rígida en lógica.

Configuración futura sugerida:

- días permitidos;
- rangos horarios;
- timezone base;
- duración;
- buffer;
- anticipación mínima;
- horizonte de reserva.

No crear un calendario propio complejo para slots. Calendar debe seguir siendo fuente de verdad para ocupación real.

## 8. Buffer

Decisión V1:

```text
15 minutos de buffer
```

Aplicación:

- evitar reuniones inmediatamente consecutivas;
- considerar eventos ocupados en Calendar con margen anterior/posterior;
- no ofrecer un slot si el buffer no puede cumplirse;
- mantener configurable.

## 9. Anticipación

Anticipación mínima:

```text
2 horas
```

No permitir reservas instantáneas con menos de 2 horas de anticipación.

Razones:

- evita mala experiencia operacional;
- da margen para revisar contexto;
- reduce reservas accidentales de último minuto.

## 10. Horizonte

Horizonte máximo de reserva:

```text
30 días
```

No mostrar disponibilidad indefinida.

Razones:

- reduce incertidumbre futura;
- simplifica el cálculo;
- evita reservar demasiado lejos sin contexto.

## 11. Datos booking

Campos V1:

- Nombre;
- Email;
- Empresa opcional;
- Teléfono opcional;
- `problemType`;
- `¿Qué necesitas conversar?` / mensaje breve;
- Fecha/hora seleccionada;
- Privacidad.

No pedir:

- RUT;
- dirección;
- cargo obligatorio;
- archivos;
- presupuesto;
- cantidad de empleados;
- contraseña;
- cuenta de usuario.

## 12. problemType

Reutilizar las categorías existentes:

1. `Automatizar un proceso`
2. `Crear una aplicación`
3. `Conectar sistemas`
4. `Trabajar con mis datos`
5. `Mejorar infraestructura`
6. `Mejorar calidad`
7. `Mejorar monitoreo / visibilidad`
8. `No estoy seguro`
9. `Otro`

Esto mantiene coherencia entre selector, formulario y agenda, y entrega contexto antes de la reunión.

## 13. UX

Flujo UX futuro:

1. usuario activa `Agenda hoy mismo`;
2. ve fechas disponibles;
3. selecciona día;
4. selecciona hora;
5. completa datos mínimos;
6. acepta privacidad;
7. confirma;
8. backend revalida disponibilidad;
9. backend crea evento;
10. Google Calendar genera Meet;
11. UI muestra confirmación.

No confiar solo en la disponibilidad cargada en frontend. El backend debe revalidar justo antes de crear el evento.

## 14. Doble reserva

Estrategia crítica:

- frontend consulta disponibilidad;
- backend vuelve a validar el slot seleccionado antes de crear evento;
- Google Calendar es fuente de verdad para conflictos;
- si el slot se ocupó, no crear evento;
- responder error de slot ocupado;
- pedir al usuario seleccionar otro horario.

Mensaje público recomendado:

```text
Ese horario acaba de dejar de estar disponible. Selecciona otro.
```

No confiar en estado local del navegador.

## 15. Calendar

Usar un calendario dedicado para reuniones comerciales.

Nombre conceptual:

```text
JonathanValdes.com - Diagnósticos
```

El `calendarId` debe ser configurable mediante variable o secret/config futura, no hardcodeado en frontend.

Razones para calendario dedicado:

- separa agenda comercial de calendario personal;
- facilita autorización OAuth controlada sobre un calendario específico;
- reduce exposición de eventos personales;
- simplifica auditoría y troubleshooting.

## 16. Meet

El evento debe crear conferencia Google Meet automáticamente mediante Google Calendar API.

La implementación futura debe crear el evento con:

- `conferenceDataVersion=1` en la solicitud;
- `conferenceData.createRequest` dentro del evento;
- `conferenceSolutionKey.type = "hangoutsMeet"` cuando corresponda;
- `requestId` único por solicitud de conferencia.

El resultado debe:

- incluir link Meet en el evento cuando Google lo haya generado correctamente;
- devolver `meetUrl` al frontend solo si la conferencia queda en estado `success`;
- incluir el link en la invitación de Calendar cuando corresponda;
- no generar Meet fuera de Calendar.

Google puede devolver inicialmente:

```text
conferenceData.createRequest.status.statusCode = "pending"
```

Por lo tanto, la implementación no debe asumir que el enlace Meet siempre estará disponible de inmediato.

Estrategia V1 para `pending`:

- comprobar la respuesta inicial de `events.insert`;
- si el estado es `success`, devolver `meetUrl`;
- si el estado es `pending`, realizar una comprobación corta y controlada del evento;
- si el link sigue pendiente, devolver confirmación de booking sin fallar toda la reserva, indicando que los detalles llegarán por Calendar;
- no construir polling complejo ni loops prolongados.

## 17. Autenticación Google

Decisión preferida V1:

```text
OAuth 2.0 con una cuenta Google propiedad de Jonathan + calendario dedicado.
```

La cuenta autenticada debe ser propietaria o tener control real sobre el calendario utilizado para los diagnósticos.

Calendario conceptual:

```text
JonathanValdes.com - Diagnósticos
```

Configuración inicial:

- realizar una autorización manual una sola vez con el usuario propietario;
- obtener y guardar de forma segura el `refresh_token` resultante;
- usar posteriormente el refresh token para renovar access tokens desde backend;
- no requerir autorización interactiva del visitante.

El backend deberá trabajar con:

- client ID;
- client secret;
- refresh token;
- calendar ID.

Estas credenciales no deben estar:

- en frontend;
- en repo;
- hardcodeadas en Lambda;
- expuestas en logs.

### Scopes OAuth recomendados

Para consultar disponibilidad, usar preferentemente:

```text
https://www.googleapis.com/auth/calendar.freebusy
```

Para crear/modificar eventos en el calendario dedicado, usar:

```text
https://www.googleapis.com/auth/calendar.events
```

Si la configuración de Google exige operar sobre un calendario específico con permisos más acotados, evaluar scopes equivalentes limitados al menor privilegio disponible antes de solicitar permisos amplios.

No solicitar scopes innecesarios como acceso completo a Drive, Gmail, perfil extendido u otros datos no relacionados con agenda.

### Service account

Service account queda como alternativa futura, no como requisito V1.

Puede resultar adecuada en un entorno Google Workspace administrado con domain-wide delegation correctamente configurada, o cuando el calendario dedicado pueda operar bajo una identidad técnica con permisos claramente controlados.

No usar service account como estrategia principal de M21.

## 18. Secrets

Credenciales Google y configuración sensible deben almacenarse fuera del repo.

Preferencia V1:

```text
AWS Secrets Manager
```

Guardar conceptualmente un secreto con los datos necesarios para renovar access tokens y operar sobre el calendario dedicado:

- client ID;
- client secret;
- refresh token;
- calendar ID;
- scopes autorizados o metadato equivalente si aporta auditoría.

No escribir valores reales en la spec, repo, frontend, Terraform plano ni logs.

Alternativa de menor costo:

```text
SSM Parameter Store SecureString
```

Decisión inicial:

- usar Secrets Manager para el paquete OAuth principal;
- evaluar SSM SecureString solo si la configuración final es simple y no aumenta riesgo;
- no crear secretos todavía durante la preparación documental.

Nunca exponer secretos en respuestas públicas ni logs.

## 19. Endpoint strategy

Opciones:

### Extender Lambda actual de leads

Ventajas:

- menos recursos;
- una Function URL.

Desventajas:

- mezcla contacto escrito, SES, agenda, Calendar y Meet;
- aumenta riesgo de cambios cruzados;
- complica permisos IAM;
- dificulta pruebas.

### Lambda separada para bookings

Ventajas:

- responsabilidades claras;
- IAM aislado;
- despliegue y pruebas más simples;
- menor riesgo sobre lead API existente;
- encaja mejor con Calendar/Meet/secrets.

Decisión M21:

```text
Crear Lambda separada para bookings.
```

Function URL propia con action routing simple:

```json
{ "action": "getAvailability" }
{ "action": "createBooking" }
```

No usar API Gateway en V1 salvo necesidad futura documentada.

## 20. Availability

El cálculo futuro de disponibilidad debe considerar:

- timezone base `America/Santiago`;
- duración fija 30 minutos;
- disponibilidad configurada;
- eventos ocupados en Google Calendar;
- buffer de 15 minutos;
- anticipación mínima de 2 horas;
- horizonte máximo de 30 días;
- daylight saving;
- eventos all-day o bloqueos manuales;
- feriados/bloqueos si se agregan manualmente al Calendar.

El algoritmo debe generar slots desde la configuración, filtrar por ocupación real de Calendar y devolver solo slots válidos.

## 21. Availability response

Preferencia: devolver timestamps ISO UTC para evitar ambigüedad, junto con labels legibles.

Ejemplo:

```json
{
  "ok": true,
  "timezone": "America/Santiago",
  "durationMinutes": 30,
  "days": [
    {
      "date": "2026-10-05",
      "label": "Lunes 5 de octubre",
      "slots": [
        {
          "startAt": "2026-10-05T13:00:00Z",
          "endAt": "2026-10-05T13:30:00Z",
          "displayTime": "10:00"
        }
      ]
    }
  ]
}
```

`displayTime` puede representar hora local de la UI, pero `startAt` y `endAt` deben ser la fuente robusta para el backend.

## 22. Booking request

Request conceptual:

```json
{
  "action": "createBooking",
  "name": "Juan Pérez",
  "email": "juan@empresa.cl",
  "company": "Empresa ABC",
  "phone": "+56...",
  "problemType": "Conectar sistemas",
  "message": "Queremos revisar una integración...",
  "startAt": "2026-10-05T13:00:00Z",
  "privacyAccepted": true,
  "source": "website",
  "clientRequestId": "uuid-del-cliente",
  "website": ""
}
```

Campos obligatorios:

- `action`;
- `name`;
- `email`;
- `problemType`;
- `message`;
- `startAt`;
- `privacyAccepted`;
- `source`.

Campos opcionales:

- `company`;
- `phone`;
- `clientRequestId`;
- `website` honeypot.

No aceptar archivos.

## 23. Booking response

Success conceptual cuando Meet está disponible:

```json
{
  "ok": true,
  "bookingId": "...",
  "startAt": "2026-10-05T13:00:00Z",
  "endAt": "2026-10-05T13:30:00Z",
  "timezone": "America/Santiago",
  "meetStatus": "success",
  "meetUrl": "https://meet.google.com/..."
}
```

Success conceptual cuando Calendar creó el evento pero Meet sigue pendiente:

```json
{
  "ok": true,
  "bookingId": "...",
  "startAt": "2026-10-05T13:00:00Z",
  "endAt": "2026-10-05T13:30:00Z",
  "timezone": "America/Santiago",
  "meetStatus": "pending"
}
```

Decisión:

```text
Exponer meetUrl directamente solo cuando Calendar lo entregue en estado success.
```

Justificación:

- el usuario necesita acceso claro a la reunión;
- el link estará en la invitación de Calendar cuando Google lo haya generado;
- la reserva no debe fallar si el evento fue creado correctamente pero Meet queda momentáneamente pendiente;
- no debe inventarse ni mostrarse un enlace si Calendar/Meet no lo entrega.

No devolver credenciales, calendarId interno ni payload crudo.

## 24. UI success/error

Confirmación UI sugerida:

```text
Tu reunión quedó agendada. Recibirás los detalles de la cita y podrás ingresar mediante Google Meet.
```

No mostrar éxito si Calendar o Meet fallan.

Errores públicos:

- slot ocupado;
- datos inválidos;
- Calendar temporalmente no disponible;
- Meet no pudo generarse;
- error de autenticación interno;
- error interno.

Mensajes deben ser claros y genéricos, sin filtrar detalles técnicos.

Ejemplo slot ocupado:

```text
Ese horario acaba de dejar de estar disponible. Selecciona otro.
```

## 25. Invitación Calendar

Decisión V1:

```text
Usar invitación de Google Calendar como confirmación por email al cliente.
```

Reglas:

- agregar al visitante como attendee del evento;
- usar una estrategia equivalente a `sendUpdates="all"` para que Google Calendar gestione la invitación;
- no duplicar confirmación con SES al cliente en V1;
- no crear template propio de confirmación al cliente.

Esto reduce complejidad y evita duplicar mensajes transaccionales.

## 26. SES interno

Decisión V1 Agenda:

```text
No agregar SES interno separado para booking inicialmente.
```

Razón:

- el evento aparecerá en el calendario dedicado;
- Calendar enviará invitación/actualización;
- evita duplicar notificaciones;
- mantiene M21 acotado.

Una notificación SES interna de booking puede evaluarse después si Calendar no es suficiente.

## 27. DynamoDB booking decision

Opciones:

A. Calendar como fuente principal.
B. Calendar + DynamoDB para trazabilidad.

Decisión V1:

```text
Google Calendar será la fuente de verdad para bookings.
```

DynamoDB queda fuera de M21 para reservas, salvo que al implementar se identifique una necesidad real de idempotencia/trazabilidad que Calendar no cubra de forma razonable.

Justificación:

- evita duplicar estado;
- reduce riesgo de desincronización;
- Calendar ya contiene evento, attendees, Meet y disponibilidad;
- mantiene simplicidad serverless.

Posible evolución futura:

- tabla `jonathanvaldes-bookings` para auditoría;
- estado de reserva;
- reconciliación;
- analytics comercial.

## 28. Privacidad

Antes de producción real, `/privacidad` deberá reflejar:

- datos del booking;
- finalidad de agendar diagnóstico tecnológico;
- procesamiento por Google Calendar;
- generación y uso de Google Meet;
- almacenamiento/procesamiento técnico en AWS Lambda;
- manejo de email e invitaciones;
- retención básica si se define.

No modificar `/privacidad` al preparar esta spec.

## 29. CORS

CORS debe restringirse a:

```text
https://jonathanvaldes.com
```

Localhost solo para desarrollo mediante configuración por ambiente.

No usar wildcard productivo.

## 30. Validación

Validación backend obligatoria:

- método/action permitidos;
- contrato cerrado;
- `name` obligatorio;
- `email` válido;
- `problemType` dentro de categorías aprobadas;
- `message` obligatorio;
- `startAt` ISO UTC;
- `privacyAccepted === true`;
- `source === website`;
- duración fija 30 minutos;
- slot dentro de disponibilidad configurada;
- slot dentro de horizonte de 30 días;
- slot con al menos 2 horas de anticipación;
- slot disponible en Calendar al momento de confirmar;
- honeypot vacío si aplica;
- payload limit.

No aceptar timestamps arbitrarios fuera de disponibilidad.

## 31. Antispam

Estrategia V1:

- honeypot si hay formulario de booking;
- payload limit;
- validación backend estricta;
- contrato cerrado;
- CORS restringido;
- prevención de doble submit en frontend futuro;
- rate limiting futuro en M22 si aparece abuso.

No agregar CAPTCHA inicialmente.

## 32. Idempotencia

Objetivo: evitar eventos duplicados por doble click, retry del navegador o latencia.

Preferencia simple V1:

- frontend genera `clientRequestId` UUID por intento de reserva;
- backend usa `clientRequestId` como parte de `requestId`/`extendedProperties.private` del evento Calendar;
- backend revalida Calendar antes de crear;
- si detecta evento ya creado para el mismo `clientRequestId`, responde con la reserva existente si es seguro;
- si no hay `clientRequestId`, backend puede rechazar o generar protección mínima por email+startAt dentro de ventana corta.

No implementar colas ni locks distribuidos en V1 salvo necesidad real.

## 33. Logging

Logs permitidos:

- `requestId`;
- `bookingId`;
- código técnico de estado;
- error code técnico;
- acción (`getAvailability`, `createBooking`).

No loggear:

- email completo;
- mensaje completo;
- tokens;
- credenciales;
- refresh tokens;
- payload completo;
- Meet URL si no es necesario;
- datos sensibles del calendario.

## 34. IAM

Permisos AWS esperados para Lambda booking:

- lectura del secreto OAuth Google desde AWS Secrets Manager o SSM;
- permisos básicos de logging Lambda.

Least privilege:

- secret ARN específico;
- no acceso amplio a todos los secrets;
- no permisos S3;
- no permisos SES si no se usa;
- no permisos DynamoDB si Calendar es fuente de verdad y no se crea tabla de bookings.

Si se usa Secrets Manager:

```text
secretsmanager:GetSecretValue
```

sobre un secreto específico.

Si se usa SSM SecureString:

```text
ssm:GetParameter
kms:Decrypt
```

solo sobre recursos específicos.

## 35. Frontend

Decisión UI futura:

```text
Panel inline dentro de #contacto o inmediatamente asociado al CTA final.
```

Justificación:

- conserva contexto comercial;
- evita navegación a una página separada;
- permite convivencia con WhatsApp y formulario;
- es más accesible y progresivo que un modal obligatorio;
- puede expandirse desde `Agenda hoy mismo`.

Un modal accesible puede evaluarse si el diseño se satura, pero no debe ser la primera opción.

La implementación futura debe modificar frontend solo en M21 implementación, no en esta preparación documental.

## 36. Responsive / accessibility

La agenda futura debe:

- funcionar en mobile;
- usar botones reales para slots;
- usar labels reales para campos;
- permitir navegación por teclado;
- tener foco visible;
- exponer estado seleccionado sin depender solo de color;
- anunciar errores de forma accesible;
- evitar focus trap si se usa modal;
- funcionar con lectores de pantalla;
- evitar overflow horizontal;
- mantener contraste adecuado.

## 37. Costos / simplicidad

Mantener serverless y proporcional.

No crear:

- servidor permanente;
- scheduler propio complejo;
- cron innecesario;
- base de datos solo para slots;
- múltiples tipos de reunión;
- múltiples consultores;
- lógica de disponibilidad empresarial compleja.

Google Calendar debe absorber la complejidad de ocupación real.

No solicitar permisos Google más amplios que los necesarios para freebusy y eventos del calendario dedicado.

## 38. Fuera de alcance

Fuera de alcance de M21 implementado:

- frontend de agenda;
- Lambda booking;
- Google Calendar real;
- Google Meet real;
- credenciales reales o autorización OAuth real;
- Secrets Manager/SSM real;
- Terraform;
- deploy;
- pagos;
- recordatorios SMS;
- recordatorios WhatsApp;
- Calendly externo;
- CRM;
- adjuntos;
- multiples tipos de reunión;
- multiples consultores;
- timezone manual complejo;
- Google Workspace pago o domain-wide delegation como requisito obligatorio;
- analytics;
- M22.

## 39. Riesgos / deuda

- OAuth requiere autorización inicial correcta de la cuenta propietaria del calendario.
- Refresh token, client secret y calendar ID deben almacenarse y rotarse como secretos sensibles.
- Service account queda como alternativa futura y puede requerir Google Workspace con domain-wide delegation.
- DST en Chile exige usar timezone IANA, no offsets fijos.
- Doble reserva requiere revalidación backend justo antes de crear evento.
- Calendar API/Meet pueden fallar aunque el slot parezca disponible.
- Meet puede quedar inicialmente en estado `pending`, por lo que la UI debe manejar confirmación sin link inmediato cuando corresponda.
- Invitaciones de Calendar pueden depender de configuración Google y permisos.
- Sin DynamoDB de bookings, trazabilidad comercial dependerá inicialmente de Calendar.
- `/privacidad` debe actualizarse antes de producción.
- Rate limiting queda para M22.
- La UI de agenda puede competir visualmente con WhatsApp/formulario si no se jerarquiza bien.

## 40. Criterios aceptación

Spec 021 queda aprobable si:

- define duración fija de 30 minutos;
- usa `America/Santiago` como timezone base;
- exige timestamps UTC internamente;
- define disponibilidad configurable;
- define buffer de 15 minutos;
- define anticipación mínima de 2 horas;
- define horizonte de 30 días;
- reutiliza `problemType` aprobado;
- define UX completa de agenda;
- exige revalidación backend del slot;
- usa Google Calendar como fuente de verdad para conflictos;
- define calendario dedicado configurable;
- define Google Meet automático mediante `conferenceDataVersion=1`, `conferenceData.createRequest` y `requestId` único;
- define auth Google preferida con OAuth 2.0 propietario y service account solo como alternativa futura;
- mantiene credenciales fuera de frontend/repo;
- propone Lambda separada para bookings;
- define request/response de disponibilidad y booking;
- define respuesta con `meetUrl` solo si Meet queda en estado `success` y manejo simple de `pending`;
- usa attendee y `sendUpdates="all"` para invitación de Calendar como confirmación cliente V1;
- deja SES interno de booking fuera de V1;
- decide Calendar como fuente de verdad sin DynamoDB booking inicial;
- documenta privacidad pendiente;
- define CORS restringido;
- define validación backend;
- define antispam e idempotencia simple;
- define logging sin PII;
- define IAM/secrets con mínimo privilegio;
- define frontend futuro accesible/responsive;
- no incluye pagos, Calendly, deploy ni M22.
