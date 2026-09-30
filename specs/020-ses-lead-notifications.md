# Spec 020 - SES Lead Notifications

Estado: Implementada.

Esta spec define la notificación interna por email de leads persistidos en DynamoDB. No implementa todavía SES, Lambda, Terraform, DNS, frontend, deploy ni verificación de dominios.

## 1. Objetivo

Definir M20 como notificación por email posterior a la persistencia exitosa del lead.

M20 debe extender el backend M19 sin cambiar su principio principal:

```text
El lead existe cuando DynamoDB confirma la persistencia.
```

SES es un canal de notificación operativo. SES no define si el lead fue recibido.

## 2. Contexto

M19 implementó localmente:

- Lambda Python;
- validación backend;
- DynamoDB `jonathanvaldes-leads`;
- `PutItem` con `attribute_not_exists(leadId)`;
- Lambda Function URL;
- CORS restringido;
- IAM mínimo para DynamoDB;
- respuesta pública `{ "ok": true, "leadId": "...", "status": "NEW" }`.

El handler actual persiste el lead y responde éxito solo cuando DynamoDB confirma escritura. M20 debe agregar notificación por SES después de ese punto, sin conectar todavía frontend nuevo ni avanzar hacia agenda, analytics o hardening.

## 3. Flujo

Flujo objetivo M20:

```text
Formulario
   ↓
Lambda
   ↓
Validación backend
   ↓
DynamoDB
   ↓
Lead persistido
   ↓
SES
   ↓
jonathan.valdes.o@gmail.com
```

Orden lógico:

```text
1. validar request
2. persistir DynamoDB
3. intentar SES
4. registrar resultado técnico
5. devolver success del lead
```

## 4. Destinatario V1

Destino operativo temporal V1:

```text
jonathan.valdes.o@gmail.com
```

Reglas:

- no mostrar este correo públicamente;
- no usarlo en Footer;
- no convertirlo en branding;
- no exponerlo en respuestas API;
- configurarlo vía environment/Terraform, no hardcodearlo en el handler si puede evitarse.

## 5. Migración futura

Destino futuro preferido cuando exista correo corporativo:

```text
info@jonathanvaldes.com
```

La migración debe ser operacional: cambiar variable/configuración, verificar identidad o recepción necesaria, probar deliverability y actualizar documentación. No debe requerir rediseñar el flujo de leads.

## 6. Remitente SES

El `From` debe pertenecer a una identidad SES verificada del dominio:

```text
jonathanvaldes.com
```

Remitente técnico propuesto:

```text
notificaciones@jonathanvaldes.com
```

Este remitente no implica que exista una casilla pagada o inbox tradicional. Para envío con SES puede bastar una identidad de dominio correctamente verificada y autenticada con DKIM.

No inventar registros DNS ni asumir que el buzón ya existe.

## 7. Identidad SES

Preferencia: verificar el dominio `jonathanvaldes.com` en SES, no solo un email individual.

Razones:

- facilita remitentes técnicos del dominio;
- permite DKIM administrado;
- prepara migración futura a correos corporativos;
- evita depender de una dirección personal como identidad de envío.

La identidad debe quedar gestionada o referenciada por infraestructura, pero los registros DNS de verificación se publicarán en Cloudflare en una acción controlada posterior.

## 8. Sandbox / production access

SES sandbox es regional.

En sandbox:

- solo se puede enviar desde identidades verificadas;
- solo se puede enviar hacia destinatarios verificados;
- el destinatario V1 `jonathan.valdes.o@gmail.com` tendría que estar verificado si la cuenta sigue en sandbox;
- los límites de envío son más bajos.

Antes de producción debe verificarse el estado de SES en la región elegida y decidir si se requiere production access.

Spec 020 no solicita production access, no verifica identidades y no modifica AWS.

## 9. Región

La arquitectura Terraform actual usa:

```text
us-east-1
```

M20 debe mantener SES en `us-east-1` si sigue siendo coherente con el resto del stack.

No diseñar multi-region en M20.

Razones:

- simplicidad operacional;
- coherencia con M19;
- menos variables regionales;
- suficiente para V1.

## 10. Email interno

El email interno notifica a Jonathan que existe un lead persistido.

Debe incluir como mínimo:

- Lead ID;
- fecha/hora;
- nombre;
- empresa si existe;
- email;
- teléfono si existe;
- necesidad / `problemType`;
- mensaje;
- origen / `sourceContext`.

No incluir:

- honeypot;
- headers completos;
- IP;
- cookies;
- User-Agent completo;
- metadata innecesaria;
- secretos;
- tokens;
- adjuntos.

## 11. Subject

Asunto recomendado:

```text
Nuevo contacto desde JonathanValdes.com
```

No incluir PII en el subject.

## 12. HTML / text

Preferencia M20:

- versión texto plano;
- versión HTML sencilla.

No usar:

- templates complejos;
- imágenes;
- logos remotos;
- tracking pixels;
- adjuntos;
- `SendRawEmail` para adjuntos.

Texto plano propuesto:

```text
Nuevo contacto desde JonathanValdes.com

Lead ID: {leadId}
Fecha/hora: {createdAt}
Nombre: {name}
Empresa: {company_or_dash}
Email: {email}
Teléfono: {phone_or_dash}
Necesidad: {problemType}
Origen: {sourceContext}

Mensaje:
{message}
```

HTML sencillo propuesto:

```html
<h1>Nuevo contacto desde JonathanValdes.com</h1>
<p><strong>Lead ID:</strong> {leadId}</p>
<p><strong>Fecha/hora:</strong> {createdAt}</p>
<p><strong>Nombre:</strong> {name}</p>
<p><strong>Empresa:</strong> {company_or_dash}</p>
<p><strong>Email:</strong> {email}</p>
<p><strong>Teléfono:</strong> {phone_or_dash}</p>
<p><strong>Necesidad:</strong> {problemType}</p>
<p><strong>Origen:</strong> {sourceContext}</p>
<h2>Mensaje</h2>
<p>{message}</p>
```

El HTML debe escapar contenido de usuario antes de interpolarlo.

## 13. PII

El email contiene PII por diseño porque su función es notificar un lead comercial.

Datos personales incluidos:

- nombre;
- empresa si existe;
- email;
- teléfono si existe;
- mensaje;
- tipo de problema;
- fecha/hora;
- lead ID.

Reglas:

- no duplicar PII innecesariamente;
- no loggear el body completo del email;
- no loggear email del lead;
- no loggear teléfono;
- no loggear mensaje;
- no exponer PII en responses API.

## 14. Orden persistencia/notificación

Orden obligatorio:

```text
DynamoDB success
   ↓
SES attempt
   ↓
public API success
```

La implementación puede devolver success aunque SES falle, siempre que DynamoDB ya haya confirmado la escritura.

No invertir el orden. No enviar email antes de persistir.

## 15. Comportamiento ante fallo SES

Si SES falla después de DynamoDB:

- no borrar el lead;
- no marcar el lead como perdido;
- no devolver error público que sugiera que el lead no fue recibido;
- no exponer detalles SES al usuario;
- registrar un fallo técnico sanitizado;
- dejar la posibilidad de retry/reconciliación futura.

Log permitido:

```text
lead_notification_failed request_id=... lead_id=...
```

El lead queda disponible en DynamoDB para revisión manual o proceso posterior.

## 16. API response

La respuesta pública debe mantenerse igual que M19:

```json
{
  "ok": true,
  "leadId": "...",
  "status": "NEW"
}
```

Justificación:

- el usuario necesita saber si el lead fue recibido;
- la recepción depende de DynamoDB, no de SES;
- exponer estado de notificación introduce complejidad y detalles internos;
- un fallo de SES puede recuperarse sin pedir al usuario que reenvíe.

No incluir en response:

- destinatario;
- remitente;
- SES Message ID;
- error SES;
- estado interno de notificación;
- datos personales.

## 17. Retry

Decisión M20 V1:

```text
No implementar sistema complejo de retry.
```

Preferencia inicial:

- intentar SES una vez después de persistir;
- registrar resultado técnico;
- dejar retry formal para hardening si aparece necesidad.

Opciones futuras:

- retry propio limitado;
- EventBridge;
- SQS;
- DLQ;
- proceso de reconciliación que busque leads `NEW` sin notificación confirmada;
- atributo futuro `notificationStatus` si se justifica.

M20 no debe introducir colas ni DLQ salvo que la implementación demuestre una necesidad clara y acotada.

## 18. Confirmación cliente futura

M20 V1 envía únicamente notificación interna a Jonathan.

No enviar email automático al cliente en la primera versión.

Razones:

- menor complejidad;
- menos riesgo de spam/deliverability;
- menos contenido transaccional que mantener;
- el canal se valida primero con notificación interna;
- la respuesta UI puede confirmar recepción sin email automático.

Mejora futura posible:

```text
Recibimos tu mensaje.
```

Ese email al cliente debe definirse en una spec posterior si se necesita.

## 19. IAM

Agregar a la Lambda únicamente permiso mínimo para enviar email con SES.

Permiso esperado:

```text
ses:SendEmail
```

Recurso:

- identidad SES verificada del dominio o remitente cuando AWS/Terraform permita restringirlo razonablemente.

No usar:

- `ses:*`;
- `ses:SendRawEmail` si no es necesario;
- permisos Gmail;
- permisos S3;
- permisos de recepción de correo;
- permisos amplios sobre cualquier recurso.

Mantener permisos existentes de M19:

- `dynamodb:PutItem` sobre la tabla exacta;
- permisos básicos de logging Lambda.

## 20. Variables entorno

Variables nuevas mínimas:

```text
LEAD_NOTIFICATION_TO
LEAD_NOTIFICATION_FROM
```

Valores esperados V1:

```text
LEAD_NOTIFICATION_TO=jonathan.valdes.o@gmail.com
LEAD_NOTIFICATION_FROM=notificaciones@jonathanvaldes.com
```

Reglas:

- configurarlas vía Terraform/environment;
- no hardcodear el destino en `handler.py` si puede evitarse;
- no exponerlas en responses públicas;
- no tratarlas como secretos, pero tampoco publicarlas en frontend.

Variables existentes que deben mantenerse:

- `LEADS_TABLE_NAME`;
- `ALLOWED_ORIGINS`;
- `ENVIRONMENT`.

## 21. Logging

Logs permitidos:

```text
lead_notification_sent request_id=... lead_id=...
lead_notification_failed request_id=... lead_id=...
```

También puede mantenerse:

```text
lead_created request_id=... lead_id=...
```

No loggear:

- body completo del email;
- payload completo;
- nombre;
- email del lead;
- teléfono;
- empresa;
- mensaje;
- destinatario operativo;
- remitente técnico;
- SES Message ID si no es necesario;
- stack traces públicos.

Los errores SES deben registrarse de forma sanitizada.

## 22. DNS / DKIM

SES debe verificar la identidad de envío.

Preferencia:

```text
Dominio jonathanvaldes.com verificado con DKIM
```

El dominio usa Cloudflare DNS. Para producción deberán publicarse en Cloudflare los registros que SES entregue para verificación/DKIM.

Spec 020 no debe:

- modificar Cloudflare;
- cambiar DNS;
- inventar registros;
- verificar dominio;
- asumir que DKIM ya está listo.

## 23. SPF / DMARC

Antes de producción, revisar configuración de correo del dominio:

- DKIM;
- SPF;
- DMARC.

No implementar una política DMARC agresiva inicialmente.

No inventar registros en la spec ni en Terraform. La configuración final debe basarse en el estado real del dominio, SES y Cloudflare.

## 24. Terraform

M20 debe extender la infraestructura existente de `infra/terraform/` sin rehacer M19.

Recursos/cambios previstos:

- identidad SES de dominio o email según decisión final;
- DKIM tokens/outputs si se gestiona identidad de dominio;
- variables `lead_notification_to` y `lead_notification_from`;
- variables de entorno Lambda `LEAD_NOTIFICATION_TO` y `LEAD_NOTIFICATION_FROM`;
- IAM policy adicional para `ses:SendEmail`;
- outputs útiles para verificación DNS si aplica.

Distinguir:

- Terraform puede crear identidad SES y exponer tokens DKIM;
- Cloudflare DNS requerirá publicar registros en otro paso controlado;
- `terraform apply` queda fuera de esta preparación documental.

No agregar en M20:

- API Gateway;
- S3;
- adjuntos;
- Gmail API;
- Calendar;
- analytics;
- dashboard.

## 25. Privacidad

Antes del deploy productivo del formulario conectado, `/privacidad` debe reflejar que los datos enviados:

- serán usados para responder consultas comerciales;
- serán persistidos en DynamoDB;
- podrán ser procesados por proveedores técnicos necesarios para operar el servicio, como AWS Lambda, DynamoDB y SES;
- podrán enviarse por email interno operativo para gestión del contacto.

No actualizar `/privacidad` en la preparación documental de Spec 020.

## 26. Adjuntos fuera de alcance

M20 no soporta adjuntos.

No implementar:

- PDF;
- imágenes;
- documentos;
- S3;
- presigned URLs;
- `SendRawEmail` por adjuntos;
- links temporales a archivos.

Si un prospecto necesita enviar documentos, se pedirá después del primer contacto por un canal acordado.

## 27. Fuera de alcance

No implementar en M20:

- Gmail API;
- inbox corporativo;
- recepción de correo;
- email automático al cliente;
- Calendar;
- Meet;
- S3;
- adjuntos;
- analytics;
- CRM;
- marketing email;
- newsletter;
- templates complejos;
- deploy;
- DNS real;
- verificación de dominio;
- production access SES;
- M21.

## 28. Riesgos / deuda

- SES sandbox puede impedir envío al Gmail destino si no está verificado.
- Production access puede ser necesario antes de enviar libremente.
- Dominio/DKIM requieren coordinación con Cloudflare DNS.
- Deliverability inicial dependerá de configuración de dominio, DKIM, SPF y DMARC.
- Si SES falla, el lead queda persistido pero sin notificación automática.
- Sin retry formal, una falla temporal SES requerirá revisión manual o módulo futuro.
- El Gmail V1 es operativo temporal y no debe quedar como identidad pública del negocio.
- `/privacidad` debe actualizarse antes de producción real.
- Registrar PII por accidente en logs sería un riesgo operativo importante.

## 29. Criterios de aceptación

Spec 020 queda aprobable si:

- define que SES ocurre después de DynamoDB;
- define que fallo SES no pierde el lead;
- mantiene success API si DynamoDB persistió correctamente;
- usa `jonathan.valdes.o@gmail.com` como destino V1;
- impide exposición pública del Gmail;
- propone `notificaciones@jonathanvaldes.com` o equivalente como remitente técnico;
- exige identidad SES verificada;
- contempla SES sandbox regional y production access futuro;
- mantiene región `us-east-1` si sigue coherente con el stack;
- define email interno con subject y contenido mínimo;
- define versión texto plano y HTML sencillo;
- documenta PII y logging sin PII;
- define IAM mínimo con `ses:SendEmail`;
- define variables `LEAD_NOTIFICATION_TO` y `LEAD_NOTIFICATION_FROM`;
- documenta DNS/DKIM en Cloudflare sin modificar DNS;
- documenta SPF/DMARC sin inventar registros;
- define Terraform previsto sin rehacer M19;
- excluye adjuntos, S3, Gmail API y templates complejos;
- deja email al cliente fuera de V1 inicial;
- no implementa M21.