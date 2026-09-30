# Spec 016 - Lead Capture Architecture

Estado: Implementada.

## 1. Objetivo

Definir la arquitectura funcional y técnica de captación de leads de la V1 de `jonathanvaldes.com`, sin implementar todavía frontend, backend, infraestructura ni integraciones.

La V1 debe convertir visitantes en conversaciones comerciales calificadas mediante tres caminos:

1. WhatsApp.
2. Agenda.
3. Formulario.

North-star:

```text
qualified commercial conversations
```

La prioridad es baja fricción, contacto directo y arquitectura serverless simple.

## 2. Contexto

La landing comercial ya está cerrada como frontend estático. Los CTA actuales son placeholders controlados hacia `#contacto`:

- `Háblanos hoy`;
- `Agenda hoy mismo`;
- `Cuéntame tu caso`;
- `Evaluar mi proyecto`.

Fase 1 define que el objetivo comercial es generar conversaciones con empresas que tengan problemas tecnológicos reales. Fase 2 aprueba una arquitectura serverless con Lambda Function URL, SES, DynamoDB y Google Calendar/Meet como evolución. Fase 3 define WhatsApp como CTA principal, agenda como CTA secundario y conversación comercial cualificada como métrica principal.

La Spec 016 no implementa nada. Solo deja definido el diseño funcional/técnico para módulos posteriores.

## 3. Principios V1

La captación V1 debe seguir estos principios:

- conversión antes que complejidad;
- contacto directo;
- mínimo número de campos;
- arquitectura serverless;
- pago por uso;
- sin servidor permanente;
- sin cuentas;
- sin login;
- sin dashboard administrativo en V1;
- sin archivos adjuntos;
- sin CRM externo obligatorio;
- sin pagos;
- sin workflows complejos;
- sin automatizaciones innecesarias;
- validación backend obligatoria para datos recibidos;
- privacidad actualizada antes de deploy productivo del formulario.

Objetivo principal:

```text
generar conversaciones comerciales calificadas
```

## 4. Arquitectura general

Arquitectura conceptual V1:

```text
                         Landing
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
      WhatsApp           Agenda           Formulario
          │                 │                 ▼
          │                 │              Lambda
          │                 │                 │
          │                 │        ┌────────┴────────┐
          │                 │        ▼                 ▼
          │                 │    DynamoDB             SES
          │                 │        │                 │
          ▼                 ▼        ▼                 ▼
 Conversación       Calendar / Meet  Lead         Notificación
```

Reglas arquitectónicas:

- usar Lambda Function URL, no API Gateway en V1;
- usar DynamoDB para persistir leads;
- usar SES para notificar a Jonathan;
- usar Google Calendar API y Meet para agenda en un módulo posterior;
- no usar EC2 permanente;
- no usar SQLite sobre S3;
- no usar S3 para leads ni adjuntos en V1;
- no implementar analytics en Spec 016.

## 5. WhatsApp

### Rol

WhatsApp será el CTA principal para contacto rápido.

CTA relacionado:

```text
Háblanos hoy
```

### Comportamiento futuro

En un módulo posterior, los enlaces `Háblanos hoy` deberán abrir WhatsApp mediante URL `wa.me` con un mensaje inicial prellenado.

No se debe inventar número. El número real queda pendiente de configuración.

### Mensajes propuestos

Mensaje general:

```text
Hola Jonathan, vi tu sitio y quiero conversar sobre un problema tecnológico en mi empresa.
```

Mensaje desde Hero:

```text
Hola Jonathan, vi tu sitio y quiero conversar sobre un problema tecnológico.
```

Mensaje desde selector, ejemplo `Automatizar un proceso`:

```text
Hola Jonathan, quiero conversar sobre la automatización de un proceso en mi empresa.
```

Mensaje desde PoC:

```text
Hola Jonathan, quiero evaluar si mi proyecto puede validarse con una prueba de concepto.
```

### Contexto según origen

Cuando el CTA venga del selector de problemas, el mensaje futuro puede variar según el `problemType` seleccionado. Esta lógica debe ser pequeña, local al frontend y sin analytics invasivo.

No implementar WhatsApp en Spec 016.

## 6. Agenda

### Rol

Agenda será el CTA secundario para visitantes con intención alta que quieren coordinar una conversación.

CTA relacionado:

```text
Agenda hoy mismo
```

### Objetivo

Permitir reservar una conversación inicial de:

```text
30 minutos
```

Nombre sugerido del evento:

```text
Diagnóstico tecnológico
```

La reunión sirve para:

- entender el problema;
- conocer contexto;
- evaluar factibilidad;
- definir siguiente paso.

No debe presentarse como consultoría técnica completa gratuita.

### Arquitectura futura

```text
Landing
  ↓
Booking endpoint
  ↓
Google Calendar API
  ↓
Evento
  ↓
Google Meet
  ↓
Confirmación
```

### Campos mínimos para agenda futura

- fecha;
- horario;
- nombre;
- email;
- empresa opcional;
- motivo/problema breve.

### Reglas futuras

La integración de agenda deberá contemplar:

- disponibilidad;
- timezone;
- buffer entre reuniones;
- prevención de doble reserva;
- creación de evento;
- creación de Google Meet cuando corresponda;
- confirmación por correo.

No implementar Calendar ni Meet en Spec 016.

## 7. Formulario

### Rol

El formulario será una alternativa para quienes prefieren explicar el caso por escrito.

Debe ser una sección dentro de la landing, no un modal.

Razones:

- mejor accesibilidad;
- mejor progressive enhancement;
- menor dependencia de JavaScript;
- más simple de mantener;
- más coherente con la arquitectura estática actual.

### Ubicación recomendada

Ubicar el formulario dentro de `#contacto` o inmediatamente después del bloque CTA final, manteniendo el CTA final como cierre comercial.

La futura implementación debe evitar competir visualmente con tres botones equivalentes. WhatsApp y Agenda mantienen jerarquía de CTA; el formulario se presenta como alternativa escrita.

### No adjuntos

No habrá campo de archivo en V1.

Si el caso requiere documentación, el usuario podrá compartirla posteriormente por email u otro canal acordado después del primer contacto.

## 8. Campos

Campos definitivos para el formulario V1:

### Nombre

- obligatorio;
- tipo `text`;
- longitud máxima sugerida: 120 caracteres.

### Empresa

- opcional;
- tipo `text`;
- longitud máxima sugerida: 160 caracteres.

### Email

- obligatorio;
- tipo `email`;
- longitud máxima sugerida: 180 caracteres.

### Teléfono / WhatsApp

- opcional;
- tipo `tel`;
- longitud máxima sugerida: 40 caracteres.

### ¿Qué necesitas resolver?

- obligatorio;
- tipo `select` o radio group accesible;
- categorías consistentes con el selector actual:
  - Automatizar un proceso
  - Crear una aplicación
  - Conectar sistemas
  - Trabajar con mis datos
  - Mejorar infraestructura
  - Mejorar calidad
  - Mejorar monitoreo / visibilidad
  - No estoy seguro
  - Otro

### Cuéntame tu problema

- obligatorio;
- textarea;
- longitud máxima sugerida: 2000 caracteres.

Texto de ayuda:

```text
Cuéntame brevemente qué ocurre hoy, qué quieres mejorar o qué resultado esperas conseguir. No necesitas tener definida la solución técnica.
```

### Privacidad

- obligatorio;
- checkbox;
- debe enlazar a `/privacidad`.

Copy conceptual:

```text
He leído y acepto la Política de Privacidad.
```

### Honeypot

- campo oculto visualmente para usuarios reales;
- no debe ser anunciado como campo relevante;
- si llega lleno al backend, se rechaza o se descarta silenciosamente según política posterior.

## 9. UX

Jerarquía visual propuesta:

1. WhatsApp como acción principal para conversación rápida.
2. Agenda como acción secundaria para intención alta.
3. Formulario como alternativa escrita.

La UX debe evitar tres botones equivalentes compitiendo entre sí en todas las secciones.

Modelo recomendado en `#contacto`:

- mantener título y copy actual;
- mostrar CTA principal `Háblanos hoy`;
- mostrar CTA secundario `Agenda hoy mismo`;
- debajo, presentar el formulario con encabezado breve tipo `Prefieres escribir primero?` o equivalente aprobado en una spec futura;
- mantener formulario sobrio, breve y accesible.

No implementar copy visual final del formulario en Spec 016.

## 10. Flujo frontend

Flujo conceptual del formulario:

```text
Usuario completa formulario
        ↓
Validación frontend
        ↓
POST Lambda Function URL
        ↓
Validación backend
        ↓
Generación leadId
        ↓
DynamoDB
        ↓
SES
        ↓
Respuesta OK
        ↓
Mensaje de confirmación
```

El frontend debe:

- validar campos obligatorios;
- validar formato básico de email;
- aplicar trim a textos;
- prevenir doble submit mientras la solicitud está pendiente;
- mostrar estados claros;
- no decir que el lead fue recibido si Lambda/DynamoDB fallaron;
- funcionar de forma accesible con teclado y lectores de pantalla.

## 11. API

La V1 debe basarse en:

```text
Lambda Function URL
```

No usar API Gateway inicialmente.

### Endpoint conceptual

Si existe enrutamiento simple dentro de una única Function URL, usar:

```text
POST /lead
```

Si la Function URL no usa router HTTP completo, usar un contrato simple con acción:

```json
{
  "action": "createLead"
}
```

### Recomendación

Para V1, la opción más limpia es una única Lambda Function URL con un handler pequeño que acepte `POST` y `action: "createLead"`. Esto evita sobreconstruir rutas antes de tener volumen real.

La evolución a rutas formales o API Gateway queda documentada para cuando existan varias operaciones públicas, autenticación avanzada, stages, API keys o políticas empresariales.

## 12. Payload

Contrato conceptual de lead:

```json
{
  "action": "createLead",
  "name": "Juan Pérez",
  "company": "Empresa ABC",
  "email": "juan@empresa.cl",
  "phone": "+56...",
  "problemType": "Automatizar un proceso",
  "message": "Hoy realizamos...",
  "privacyAccepted": true,
  "source": "website",
  "sourceContext": "final-cta"
}
```

No incluir en V1:

```json
{
  "attachments": []
}
```

Tampoco incluir campos no solicitados como presupuesto obligatorio, RUT, dirección, cargo obligatorio, cantidad de empleados, contraseña, cuenta o aceptación de marketing.

## 13. Source context

Se debe capturar contexto comercial sin tracking invasivo.

Valores permitidos de `sourceContext`:

- `hero`;
- `problem-selector`;
- `poc`;
- `final-cta`;
- `form`.

Valor base de `source`:

```text
website
```

Si el usuario interactuó con el selector de problemas, el frontend futuro puede preseleccionar `problemType` en el formulario.

Ejemplo:

```json
{
  "source": "website",
  "sourceContext": "problem-selector",
  "problemType": "Automatizar un proceso"
}
```

Esto no es analytics. Es contexto del lead enviado voluntariamente al iniciar contacto.

## 14. Validación frontend

La validación frontend debe incluir:

- `required` en nombre, email, problemType, message y privacidad;
- `type="email"` para email;
- `type="tel"` para teléfono;
- trim de strings antes de enviar;
- longitudes máximas razonables;
- mensajes de error visibles y asociados al campo;
- no enviar si privacidad no está aceptada;
- deshabilitar temporalmente submit durante envío.

La validación frontend no reemplaza la validación backend.

## 15. Validación backend

El backend futuro debe validar:

- método HTTP permitido;
- `action` permitida;
- campos obligatorios;
- tipos de datos;
- longitudes máximas;
- email válido;
- categorías permitidas de `problemType`;
- `privacyAccepted === true`;
- payload size;
- honeypot;
- sanitización de strings;
- normalización básica;
- rechazo de campos inesperados cuando corresponda.

No confiar en el frontend.

## 16. DynamoDB

Objetivo: persistir leads independientemente del correo.

Tabla conceptual:

```text
jonathanvaldes-leads
```

Modo recomendado:

```text
PAY_PER_REQUEST
```

o equivalente On-Demand.

### Clave primaria

- partition key: `leadId`.

### Campos mínimos

```text
leadId
createdAt
name
company
email
phone
problemType
message
source
sourceContext
status
privacyAccepted
userAgent
```

`userAgent` puede guardarse si aporta contexto técnico básico, sin convertirlo en tracking invasivo.

### Status inicial

```text
NEW
```

### Estados futuros posibles

- NEW
- CONTACTED
- QUALIFIED
- PROPOSAL
- WON
- LOST
- ARCHIVED

La V1 no necesita UI administrativa para cambiar estados. Cualquier cambio de estado puede hacerse manualmente en consola o mediante herramienta futura.

## 17. SES

Objetivo: enviar notificación a Jonathan después de recibir correctamente un lead.

Email conceptual para Jonathan:

```text
Nuevo contacto desde JonathanValdes.com

Nombre:
...

Empresa:
...

Email:
...

Teléfono:
...

Necesidad:
...

Mensaje:
...

Origen:
...

Lead ID:
...
```

Reglas:

- no adjuntar archivos;
- no incluir HTML complejo si texto plano basta;
- no exponer secretos;
- no decir éxito al usuario si DynamoDB falla;
- destinatario futuro objetivo: `info@jonathanvaldes.com`;
- SES/dominio quedan pendientes de infraestructura.

### Email al cliente

Preferencia: sí, pero como segunda prioridad.

Puede implementarse en el mismo módulo SES si la infraestructura ya está lista y no complica el alcance. Si aumenta el riesgo, dejarlo para un módulo posterior.

Mensaje conceptual:

```text
Recibimos tu mensaje. Revisaremos el caso y te contactaremos.
```

## 18. Estados UI

Estados mínimos del formulario:

### Idle

Formulario disponible para completar.

### Enviando

```text
Enviando...
```

El botón submit debe deshabilitarse temporalmente.

### Éxito

```text
Gracias. Recibimos tu mensaje y revisaremos el caso para definir el siguiente paso.
```

Mostrar solo si Lambda respondió OK después de validar, persistir y disparar notificación según el contrato definido.

### Error

```text
No pudimos enviar tu mensaje. Intenta nuevamente o utiliza otro canal de contacto.
```

No afirmar recepción si Lambda, DynamoDB o validación fallaron.

## 19. Idempotencia

Prevención básica V1:

- deshabilitar submit mientras la solicitud está pendiente;
- evitar double-click;
- generar `leadId` único en backend;
- responder de forma clara si hay error;
- no implementar mecanismos complejos de idempotency keys en el primer formulario salvo que aparezca una necesidad real.

`leadId` debe ser UUID u otro identificador no secuencial. No debe contener información personal.

## 20. Antispam

Estrategia V1 recomendada:

1. Honeypot.
2. Límites de payload.
3. Validación backend estricta.
4. Rechazo de campos inesperados.
5. Logs básicos para abuso.
6. Rate limiting/abuse controls en fase de seguridad.

No agregar CAPTCHA inicialmente salvo que aparezca abuso real.

## 21. Privacidad

Antes del deploy productivo del formulario, `/privacidad` debe actualizarse porque el sitio comenzará a tratar:

- nombre;
- email;
- teléfono opcional;
- empresa;
- mensaje;
- tipo de problema;
- fecha/hora de recepción;
- metadatos técnicos mínimos si se guardan.

Spec 016 no actualiza `/privacidad`. Solo documenta la obligación para el módulo que active el formulario.

El checkbox de privacidad debe enlazar a:

```text
/privacidad
```

## 22. Jerarquía de canales

### CTA principal: WhatsApp

Para conversación rápida y directa.

### CTA secundario: Agenda

Para usuarios con intención alta que prefieren coordinar reunión.

### Alternativa: Formulario

Para explicar el caso por escrito.

Regla UX:

- no mostrar tres botones con igual jerarquía en todas las secciones;
- mantener WhatsApp y Agenda como acciones visibles;
- presentar formulario como alternativa clara, no como CTA competidor dominante.

## 23. Adjuntos fuera de alcance V1

Decisión final V1:

```text
No soportar archivos adjuntos.
```

No implementar:

- PDFs;
- imágenes;
- documentos;
- licitaciones adjuntas;
- uploads;
- S3 para leads;
- presigned URLs;
- envío de adjuntos por SES.

Razones:

- reducir fricción;
- reducir infraestructura;
- reducir superficie de seguridad;
- evitar manejo prematuro de archivos sensibles;
- validar primero demanda real.

## 24. Evolución futura con S3

Si el negocio demuestra necesidad real de adjuntos, una fase posterior puede evaluar:

```text
Formulario
   ↓
Lambda solicita upload
   ↓
Presigned URL
   ↓
S3 privado
   ↓
DynamoDB guarda metadata
   ↓
SES notifica con link temporal
```

Requisitos futuros si se implementa:

- bucket privado;
- presigned URLs con expiración corta;
- límites de tamaño;
- tipos MIME permitidos;
- antivirus o scanning si aplica;
- metadata en DynamoDB;
- links temporales en SES;
- política de retención;
- actualización de privacidad.

Esto queda fuera de V1.

## 25. Seguridad futura

La implementación posterior debe contemplar:

- HTTPS;
- CORS restringido;
- validación server-side;
- sanitización;
- payload limits;
- honeypot;
- abuse protection;
- rate limiting si aparece abuso;
- IAM least privilege;
- logs;
- alertas;
- secretos fuera del frontend;
- SES verificado;
- variables de entorno para configuración;
- no exponer credenciales AWS ni Google en JavaScript;
- headers de seguridad en infraestructura.

Spec 016 no implementa seguridad. Solo define requisitos para módulos posteriores.

## 26. Observabilidad futura

No implementar analytics en Spec 016.

Eventos conceptuales futuros:

- `contact_started`;
- `contact_submitted`;
- `booking_started`;
- `booking_completed`;
- `whatsapp_clicked`.

Principios:

- medir eventos comerciales de alto valor;
- no registrar scroll granular ni movimiento de mouse;
- no crear tracking excesivo;
- no mostrar contador público de visitas.

## 27. Costos/serverless

La arquitectura sigue siendo adecuada para V1 porque:

- tráfico inicial esperado es bajo;
- Lambda cobra por uso;
- DynamoDB On-Demand evita capacidad fija;
- SES es proporcional al envío;
- Calendar API evita construir agenda propia desde cero;
- no hay servidor permanente;
- no hay base relacional administrada;
- no hay API Gateway salvo necesidad futura.

No se realizan estimaciones monetarias exactas en Spec 016.

## 28. Módulos siguientes

Roadmap propuesto:

### M17 - WhatsApp

Conectar CTA principal y mensajes contextuales. Requiere número real aprobado.

### M18 - Formulario frontend

Construir sección de formulario dentro o después de `#contacto`, con validación frontend, estados UI y progressive enhancement.

### M19 - Lambda + SES

Crear backend de recepción, validación server-side y notificación a Jonathan mediante SES.

### M20 - DynamoDB

Persistir leads en `jonathanvaldes-leads`.

Nota: si al implementar se reduce riesgo juntando persistencia y recepción, M19/M20 pueden combinarse en un único módulo backend documentado, siempre que el alcance siga pequeño.

### M21 - Agenda / Google Calendar + Meet

Implementar reserva de diagnóstico tecnológico de 30 minutos.

### M22 - Seguridad / hardening

CORS, abuso, límites, logs, IAM, headers, revisión de privacidad y protección operativa.

### M23 - Observabilidad de conversión

Medir eventos comerciales de alto valor sin tracking excesivo.

### M24 - Integración y pruebas finales

Validación completa de flujos WhatsApp, formulario, agenda, legales y errores.

### M25 - Deploy

Publicación controlada en infraestructura aprobada.

## 29. Fuera de alcance

No implementar en Spec 016:

- frontend del formulario;
- WhatsApp real;
- número telefónico;
- SES;
- DynamoDB;
- Lambda;
- Calendar;
- Meet;
- analytics;
- archivos;
- S3 leads;
- presigned URLs;
- CAPTCHA;
- CRM;
- dashboard;
- login;
- pagos;
- deploy.

## 30. Riesgos/deuda

- Número real de WhatsApp pendiente.
- Dominio/correo SES pendiente.
- Privacidad debe actualizarse antes del formulario productivo.
- Calendar/Meet requiere credenciales y permisos de Google.
- Function URL pública requiere validación y abuso controlado.
- Sin dashboard V1, el seguimiento comercial dependerá de email/DynamoDB/manual.
- Email automático al cliente puede aumentar alcance si SES no está listo.
- Adjuntos quedan fuera; algunos prospectos podrían querer enviar documentos, pero se manejará posterior al primer contacto.
- Rate limiting queda para hardening salvo abuso temprano.

## 31. Criterios de aceptación

Spec 016 queda aprobable cuando:

- define claramente los 3 canales;
- WhatsApp es CTA principal;
- Agenda es CTA secundaria;
- formulario es alternativa;
- formulario tiene pocos campos;
- no contiene adjuntos;
- define Lambda Function URL;
- define DynamoDB para leads;
- define SES para notificación;
- no usa API Gateway sin necesidad;
- no usa servidor permanente;
- define actualización futura de privacidad;
- documenta antispam básico;
- documenta seguridad futura;
- documenta S3 solo como evolución;
- no implementa ninguna integración;
- propone roadmap M17+.

## 32. Decisiones finales

- V1 tendrá tres caminos de captación: WhatsApp, Agenda y Formulario.
- WhatsApp será el CTA principal.
- Agenda será CTA secundaria para diagnóstico de 30 minutos.
- Formulario será alternativa escrita dentro o inmediatamente después de `#contacto`.
- No habrá adjuntos en V1.
- No habrá S3 para leads en V1.
- No habrá presigned URLs en V1.
- No habrá API Gateway inicialmente.
- No habrá dashboard administrativo en V1.
- Lambda Function URL será el backend inicial.
- DynamoDB persistirá leads.
- SES notificará a Jonathan.
- Google Calendar/Meet se implementará en módulo posterior.
- `/privacidad` deberá actualizarse antes del deploy productivo del formulario.