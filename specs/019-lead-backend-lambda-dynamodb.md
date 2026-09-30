# Spec 019 - Lead Backend Lambda DynamoDB

Estado: Implementada.

Esta spec define el backend V1 para recibir y persistir leads del formulario de contacto de `jonathanvaldes.com`. No implementa todavía Lambda, DynamoDB, Terraform, SES, frontend, deploy ni integraciones reales.

## 1. Objetivo

Definir el contrato técnico y operativo del endpoint serverless que recibirá leads desde el formulario implementado en M18.

M19 debe preparar una implementación posterior basada en:

```text
Frontend
  ↓
Lambda Function URL
  ↓
Validación backend
  ↓
Generación leadId
  ↓
DynamoDB
  ↓
Respuesta JSON
```

Principio central:

```text
Persistir el lead antes de cualquier email.
```

Un lead válido existe cuando DynamoDB confirma la escritura. El correo no define la existencia del lead.

## 2. Contexto

Spec 016 definió la arquitectura de captación V1: WhatsApp como canal principal, Agenda como secundario y Formulario como alternativa escrita.

Spec 018 implementó el formulario frontend con validación local y estado transitorio honesto, sin envío real. M19 será el primer módulo backend para habilitar recepción real de leads, pero esta spec solo documenta el contrato.

La arquitectura aprobada de Fase 2 prioriza una V1 serverless, simple y económica:

- Lambda Function URL;
- DynamoDB On-Demand;
- SES como notificación posterior;
- sin API Gateway;
- sin servidor permanente;
- sin S3 para leads;
- sin adjuntos.

## 3. Arquitectura

Arquitectura M19:

```text
Formulario frontend
        ↓
POST Lambda Function URL
        ↓
Lambda handler
        ↓
Validación y normalización
        ↓
Generación UUID leadId
        ↓
DynamoDB PutItem
        ↓
201 JSON
```

SES queda fuera de M19. La notificación por email se implementará en un módulo posterior, después de que el lead se haya persistido correctamente.

## 4. Function URL

El backend V1 usará AWS Lambda Function URL como endpoint público consumido por el navegador.

No usar API Gateway en M19.

Razones:

- pocas operaciones públicas;
- menor complejidad inicial;
- coherencia con Fase 2;
- pago por uso;
- suficiente para validar el flujo comercial V1.

Conocer la Function URL no debe considerarse un mecanismo de seguridad. La seguridad depende de validación, CORS, límites, antispam e IAM mínimo.

## 5. Método

Método permitido:

```text
POST
```

Métodos no permitidos:

- GET;
- PUT;
- PATCH;
- DELETE;
- cualquier otro método.

Los métodos no permitidos deben responder:

```text
405 Method Not Allowed
```

La Function URL debe responder `OPTIONS` solo para preflight CORS cuando corresponda.

## 6. Request contract

Payload JSON esperado:

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
  "sourceContext": "final-cta",
  "website": ""
}
```

El request debe usar:

```text
Content-Type: application/json
```

La única acción permitida en M19 es:

```text
createLead
```

## 7. Campos

Campos obligatorios:

- `action`;
- `name`;
- `email`;
- `problemType`;
- `message`;
- `privacyAccepted`;
- `source`;
- `sourceContext`.

Campos opcionales:

- `company`;
- `phone`;
- `website` como honeypot técnico.

El backend debe aplicar `trim` a strings visibles antes de validar y persistir.

## 8. problemType

Valores exactos permitidos:

1. `Automatizar un proceso`
2. `Crear una aplicación`
3. `Conectar sistemas`
4. `Trabajar con mis datos`
5. `Mejorar infraestructura`
6. `Mejorar calidad`
7. `Mejorar monitoreo / visibilidad`
8. `No estoy seguro`
9. `Otro`

Cualquier otro valor debe rechazarse con `400 Bad Request`.

## 9. source/sourceContext

Valor permitido de `source`:

```text
website
```

Valores exactos permitidos de `sourceContext`:

- `hero`;
- `problem-selector`;
- `poc`;
- `final-cta`;
- `form`.

Estos valores entregan contexto comercial del lead. No deben convertirse en tracking invasivo ni incluir identificadores persistentes del visitante.

## 10. Validación

Reglas mínimas backend:

- `action` debe ser `createLead`;
- `name` debe ser string, obligatorio, trim, máximo 120 caracteres;
- `company` debe ser string opcional, trim, máximo 160 caracteres;
- `email` debe ser string, obligatorio, trim, formato email razonable, máximo 180 caracteres;
- `phone` debe ser string opcional, trim, máximo 40 caracteres;
- `problemType` debe pertenecer a la lista permitida;
- `message` debe ser string, obligatorio, trim, mínimo 10 caracteres, máximo 2000 caracteres;
- `privacyAccepted` debe ser exactamente `true`;
- `source` debe ser `website`;
- `sourceContext` debe pertenecer a la lista permitida;
- `website` debe llegar vacío o ausente;
- payload debe estar dentro del límite aprobado;
- request debe ser JSON válido.

La validación frontend no reemplaza esta validación.

## 11. Campos inesperados

El contrato M19 es cerrado.

Solo se aceptan estos campos:

- `action`;
- `name`;
- `company`;
- `email`;
- `phone`;
- `problemType`;
- `message`;
- `privacyAccepted`;
- `source`;
- `sourceContext`;
- `website`.

Cualquier campo adicional debe rechazarse con `400 Bad Request`.

No aceptar en M19:

- `attachments`;
- presupuestos obligatorios;
- RUT;
- passwords;
- archivos;
- tokens de cliente;
- identificadores persistentes de tracking.

## 12. Payload limit

Límite elegido:

```text
32 KB
```

Justificación:

- suficiente para los campos del formulario y un mensaje de hasta 2000 caracteres;
- reduce abuso accidental o automatizado;
- evita abrir la puerta a adjuntos codificados o payloads grandes;
- mantiene bajo costo y procesamiento simple.

Si el body supera el límite, responder:

```text
413 Payload Too Large
```

## 13. Honeypot

Campo honeypot:

```text
website
```

Reglas:

- usuarios reales no deberían completarlo;
- si llega con contenido después de trim, el request se considera spam o inválido;
- no persistir el lead;
- no revelar la regla antispam en el error público;
- responder con un error genérico compatible con `400 Bad Request`.

No usar CAPTCHA en M19.

## 14. Lead ID

El backend debe generar `leadId`.

Formato recomendado:

```text
UUID v4
```

Reglas:

- no usar email como ID;
- no usar teléfono como ID;
- no usar IDs secuenciales;
- no confiar en IDs enviados por el frontend.

## 15. Timestamp

El backend debe generar `createdAt` en UTC.

Formato:

```text
ISO 8601 UTC
```

Ejemplo:

```text
2026-09-30T15:30:00Z
```

No confiar en timestamps enviados por el frontend para la fecha oficial de recepción.

## 16. Status

Estado inicial del lead:

```text
NEW
```

Estados futuros posibles, fuera de M19:

- CONTACTED;
- QUALIFIED;
- PROPOSAL;
- WON;
- LOST;
- ARCHIVED.

M19 solo debe persistir leads nuevos con `status = NEW`.

## 17. DynamoDB

Tabla conceptual:

```text
jonathanvaldes-leads
```

Modo recomendado:

```text
PAY_PER_REQUEST
```

Clave primaria:

```text
leadId (string)
```

Atributos mínimos a persistir:

- `leadId`;
- `createdAt`;
- `name`;
- `company`;
- `email`;
- `phone`;
- `problemType`;
- `message`;
- `privacyAccepted`;
- `source`;
- `sourceContext`;
- `status`.

No persistir en M19:

- honeypot `website`;
- secretos;
- tokens;
- payload completo sin filtrar;
- headers completos;
- IP completa salvo que una spec de seguridad posterior lo justifique.

## 18. Índices

M19 no requiere GSI.

Decisión:

```text
Sin índices secundarios inicialmente.
```

Razón:

- no existe dashboard V1;
- el volumen inicial será bajo;
- el acceso principal es escritura por lead nuevo;
- consultas operativas pueden resolverse manualmente en etapa inicial.

Índices futuros posibles:

- por `status`;
- por `createdAt`;
- por `sourceContext`.

## 19. Idempotencia

Estrategia V1:

- prevenir doble submit desde frontend cuando M19 conecte el envío real;
- generar `leadId` único en backend;
- usar `PutItem` condicional para evitar colisión improbable de UUID;
- no deduplicar por email, teléfono o mensaje en M19.

No implementar todavía:

- `clientRequestId`;
- deduplicación temporal;
- colas;
- reintentos avanzados.

Esto puede evaluarse si aparecen duplicados reales.

## 20. Success response

Cuando el lead se valida y se persiste en DynamoDB correctamente:

```text
201 Created
```

Respuesta JSON:

```json
{
  "ok": true,
  "leadId": "uuid-v4",
  "status": "NEW"
}
```

No devolver datos personales en la respuesta.

## 21. Error responses

Errores públicos previstos:

### 400 Bad Request

Usar para:

- JSON inválido;
- `action` inválida;
- campos obligatorios ausentes;
- tipos incorrectos;
- email inválido;
- `problemType` inválido;
- `source` inválido;
- `sourceContext` inválido;
- `privacyAccepted` distinto de `true`;
- honeypot con contenido;
- campos inesperados.

Respuesta sugerida:

```json
{
  "ok": false,
  "error": "invalid_request"
}
```

### 405 Method Not Allowed

```json
{
  "ok": false,
  "error": "method_not_allowed"
}
```

### 413 Payload Too Large

```json
{
  "ok": false,
  "error": "payload_too_large"
}
```

### 429 Too Many Requests

Reservado para un módulo futuro de abuso/rate limiting.

```json
{
  "ok": false,
  "error": "too_many_requests"
}
```

### 500 Internal Server Error

```json
{
  "ok": false,
  "error": "internal_error"
}
```

No exponer stack traces, detalles de DynamoDB, variables de entorno, ARNs ni reglas antispam.

## 22. CORS

CORS debe ser restringido.

Origen producción esperado:

```text
https://jonathanvaldes.com
```

Agregar también:

```text
https://www.jonathanvaldes.com
```

solo si esa variante se usa realmente en producción.

Ambientes locales pueden configurarse mediante variable de entorno, por ejemplo:

```text
http://localhost:3000
http://localhost:5173
```

Reglas:

- no usar `*` en producción;
- permitir `POST`;
- responder `OPTIONS` para preflight;
- permitir `Content-Type`;
- no permitir credenciales si no son necesarias.

## 23. PutItem

La persistencia debe usar `PutItem` con condición:

```text
attribute_not_exists(leadId)
```

Esto protege contra colisiones de ID y evita sobrescribir un lead existente.

Si la condición falla, responder como error interno o regenerar un UUID y reintentar una vez. Dado que UUID v4 tiene colisión extremadamente improbable, un único reintento es suficiente si se implementa.

## 24. IAM

La Lambda debe tener permisos mínimos.

Permiso requerido en M19:

```text
dynamodb:PutItem
```

Recurso:

```text
ARN exacto de la tabla jonathanvaldes-leads
```

No otorgar en M19:

- `dynamodb:*`;
- permisos sobre todas las tablas;
- S3;
- SES;
- Secrets Manager si no hay secretos;
- permisos de administración de infraestructura.

## 25. Environment variables

Variables de entorno previstas:

```text
LEADS_TABLE_NAME
ALLOWED_ORIGINS
ENVIRONMENT
```

Reglas:

- `LEADS_TABLE_NAME` es obligatoria;
- `ALLOWED_ORIGINS` debe controlar CORS por ambiente;
- `ENVIRONMENT` puede usarse para distinguir `local`, `staging` o `production`;
- no se requieren secretos en M19.

No guardar credenciales en frontend ni en archivos versionados.

## 26. Logging

Logs mínimos recomendados:

- request id de Lambda;
- resultado de validación sin payload completo;
- `leadId` cuando exista;
- error técnico resumido;
- origen aceptado o rechazado de CORS si ayuda a diagnosticar.

No loguear:

- mensaje completo del usuario;
- email completo;
- teléfono completo;
- payload completo;
- headers completos;
- secretos;
- stack traces públicos.

Si se requiere diagnóstico, usar máscaras parciales o conteos, por ejemplo longitud de mensaje y dominio de email solo si es necesario.

## 27. Antispam

Controles M19:

- honeypot;
- payload limit de 32 KB;
- contrato cerrado;
- validación estricta;
- rechazo de campos inesperados;
- CORS restringido;
- logs básicos para detectar abuso.

Fuera de M19:

- CAPTCHA;
- WAF;
- rate limiting formal;
- reputación IP;
- bloqueo por país;
- colas de moderación.

## 28. Seguridad

Requisitos de seguridad M19:

- validar en servidor todo lo recibido;
- no confiar en HTML `required` ni JS frontend;
- restringir CORS;
- limitar payload;
- evitar errores verbosos;
- IAM least privilege;
- no exponer secretos;
- no persistir campos inesperados;
- no aceptar adjuntos;
- no escribir en S3;
- no depender de la oscuridad de la Function URL.

## 29. Infraestructura

Esta spec no crea infraestructura.

Cuando se implemente M19, la infraestructura debe definirse de forma reproducible, preferentemente como IaC dentro del repo.

Antes de crear archivos reales, revisar si existe estructura previa como:

- `infra/`;
- `terraform/`;
- módulos legacy documentados.

Reglas:

- no reutilizar configuración legacy automáticamente;
- no tocar Terraform state histórico;
- no copiar `.terraform/`;
- no copiar `terraform.tfvars`;
- no desplegar sin spec e instrucción explícita.

## 30. Runtime

Runtime recomendado para Lambda M19:

```text
Python 3.x
```

Razones:

- handler pequeño;
- validación clara;
- AWS SDK disponible en runtime Lambda mediante `boto3`;
- bajo peso operacional;
- no requiere framework web.

No usar en M19:

- FastAPI;
- Flask;
- Express;
- servidor permanente;
- contenedor Lambda salvo necesidad futura.

## 31. Estructura de código

Estructura propuesta para implementación futura:

```text
backend/
  lead_api/
    handler.py
    validation.py
    README.md
```

Posibles pruebas futuras:

```text
backend/
  tests/
    test_lead_validation.py
```

La estructura final puede ajustarse si el repo ya define una convención backend antes de implementar, pero debe mantenerse pequeña y enfocada.

## 32. Dependencias

M19 debe evitar dependencias innecesarias.

Preferencias:

- librería estándar de Python para JSON, UUID, datetime, email/regex simple;
- `boto3` del runtime Lambda para DynamoDB;
- sin frameworks web;
- sin ORM;
- sin librerías de validación pesadas salvo necesidad documentada.

## 33. Contrato frontend

Cuando M19 se implemente, el formulario M18 deberá evolucionar desde estado transitorio a envío real mediante `fetch()`.

El frontend deberá enviar:

- `action` = `createLead`;
- campos visibles normalizados;
- `source` = `website`;
- `sourceContext` actual;
- honeypot `website`;
- `privacyAccepted` como boolean real.

Estados frontend esperados:

- `sending` mientras espera respuesta;
- `success` solo ante `201` con `ok: true`;
- `error` ante validación, red o error backend.

No afirmar recepción si DynamoDB falla.

## 34. Privacidad

Antes del deploy productivo del formulario conectado, `/privacidad` debe reflejar que el sitio tratará:

- nombre;
- empresa opcional;
- email;
- teléfono opcional;
- tipo de problema;
- mensaje;
- fecha y hora de recepción;
- estado comercial interno del lead;
- metadatos técnicos mínimos si una spec posterior los autoriza.

M19 no debe guardar más datos que los necesarios para gestionar el contacto.

No guardar adjuntos en V1.

## 35. SES futuro

SES queda fuera de M19.

Flujo futuro:

```text
DynamoDB guardado
  ↓
SES
  ↓
jonathan.valdes.o@gmail.com
```

Reglas futuras:

- enviar notificación solo después de persistencia exitosa;
- no usar SES para definir existencia del lead;
- no exponer `jonathan.valdes.o@gmail.com` en frontend;
- migrar posteriormente a `info@jonathanvaldes.com` cuando el correo corporativo esté listo;
- no adjuntar archivos.

## 36. Fuera de alcance

No implementar en M19 spec-prep:

- Lambda real;
- DynamoDB real;
- Terraform;
- SES;
- envío de email;
- cambios en `index.html`;
- cambios en `assets/js/main.js`;
- cambios en CSS;
- API Gateway;
- servidor permanente;
- S3 para leads;
- adjuntos;
- presigned URLs;
- CAPTCHA;
- WAF;
- dashboard;
- CRM;
- agenda;
- Google Calendar;
- Meet;
- analytics;
- deploy.

## 37. Riesgos / deuda

- Function URL pública requiere validación estricta porque la URL no es una barrera de seguridad.
- CORS restringido reduce uso desde navegador no autorizado, pero no reemplaza controles server-side.
- Sin rate limiting formal en M19, abuso sostenido queda para hardening posterior.
- Sin SES en M19, el lead puede quedar persistido sin notificación automática hasta el módulo siguiente.
- Sin dashboard V1, la revisión de leads dependerá inicialmente de DynamoDB o de la notificación futura.
- `/privacidad` debe actualizarse antes de activar envío productivo real.
- El destino `jonathan.valdes.o@gmail.com` es operativo temporal y no debe convertirse en branding público.
- No hay adjuntos; casos que requieran documentos se manejarán después del primer contacto.

## 38. Criterios de aceptación

La implementación futura de M19 será aceptada si:

- usa Lambda Function URL y no API Gateway;
- acepta solo `POST` para crear leads;
- valida `action: createLead`;
- usa contrato cerrado de request;
- rechaza campos inesperados;
- valida `problemType` con los nueve valores aprobados;
- valida `source = website`;
- valida `sourceContext` con los cinco valores aprobados;
- aplica payload limit de 32 KB;
- aplica honeypot `website`;
- genera `leadId` backend con UUID v4;
- genera `createdAt` UTC ISO 8601;
- persiste `status = NEW`;
- usa DynamoDB `PAY_PER_REQUEST`;
- usa tabla `jonathanvaldes-leads` con partition key `leadId`;
- no crea GSI inicialmente;
- usa `PutItem` con `attribute_not_exists(leadId)`;
- otorga IAM mínimo con `dynamodb:PutItem` sobre la tabla exacta;
- restringe CORS a dominios aprobados;
- no usa `*` en CORS productivo;
- registra logs útiles sin PII excesiva;
- devuelve `201` con `{ "ok": true, "leadId": "...", "status": "NEW" }` después de persistir;
- devuelve errores JSON genéricos sin detalles sensibles;
- no implementa SES todavía;
- documenta SES como integración posterior;
- no acepta adjuntos;
- no usa S3 para leads;
- no usa servidor permanente;
- no modifica frontend en la preparación documental de esta spec.