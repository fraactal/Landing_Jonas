# Spec 018 - Contact Form Frontend

Estado: Implementada.

Esta spec define la experiencia frontend del formulario de contacto de la V1 de `jonathanvaldes.com`, sin implementar todavía HTML, CSS, JavaScript, Lambda, DynamoDB, SES, agenda, analytics ni deploy.

## 1. Objetivo

Definir un formulario frontend corto para que una empresa pueda explicar su problema en menos de 2 minutos.

El formulario será el tercer canal comercial de la V1:

1. WhatsApp como canal principal.
2. Agenda como canal secundario.
3. Formulario como alternativa escrita.

M18 debe definir únicamente la experiencia frontend. No debe conectar backend real ni simular un envío exitoso antes de M19.

## 2. Contexto

La landing ya cuenta con:

- CTA de WhatsApp conectados en M17;
- `#contacto` como zona final de conversión;
- CTA `Agenda hoy mismo` todavía pendiente para M21;
- selector de problemas M05 con estado `data-problem-option`;
- arquitectura de captación definida en Spec 016.

Spec 016 define el formulario como alternativa escrita, con Lambda Function URL, DynamoDB y SES en módulos posteriores. M18 no implementa esas integraciones; solo prepara la interfaz, validación frontend y estados transitorios honestos.

## 3. Ubicación

El formulario debe integrarse en la zona de contacto de la landing.

Ubicación recomendada:

```text
Dentro o inmediatamente después de #contacto
```

Decisión para implementación futura: ubicarlo dentro de la sección `#contacto`, debajo del copy y CTAs actuales, como alternativa escrita. Esto mantiene la conversión en un solo bloque y evita crear una página separada o un modal.

No crear:

- página separada;
- modal;
- drawer;
- wizard multipaso.

## 4. Jerarquía de canales

La sección de contacto debe mantener esta jerarquía visual y funcional:

1. `Háblanos hoy` por WhatsApp: acción principal rápida.
2. `Agenda hoy mismo`: acción secundaria pendiente para M21.
3. Formulario: alternativa escrita para quien prefiere explicar el caso.

El formulario no debe competir visualmente como si fuera el único camino. Debe presentarse como una opción clara y tranquila para describir el problema.

Texto de apoyo sugerido para la zona del formulario:

```text
Si prefieres escribir primero, cuéntame brevemente el contexto y revisaremos el caso para definir el siguiente paso.
```

## 5. Campos

El formulario debe incluir 7 campos visibles y 1 honeypot invisible.

### 5.1 Nombre

- Obligatorio.
- Tipo: `text`.
- Label: `Nombre`.
- `name`: `name`.
- `autocomplete`: `name`.
- `maxlength`: `120`.

### 5.2 Empresa

- Opcional.
- Tipo: `text`.
- Label: `Empresa`.
- `name`: `company`.
- `autocomplete`: `organization`.
- `maxlength`: `160`.

### 5.3 Email

- Obligatorio.
- Tipo: `email`.
- Label: `Email`.
- `name`: `email`.
- `autocomplete`: `email`.
- `maxlength`: `180`.

### 5.4 Teléfono / WhatsApp

- Opcional.
- Tipo: `tel`.
- Label: `Teléfono / WhatsApp`.
- `name`: `phone`.
- `autocomplete`: `tel`.
- `maxlength`: `40`.

No exigir formato chileno exclusivamente. Debe aceptar clientes de otros países en el futuro.

### 5.5 ¿Qué necesitas resolver?

- Obligatorio.
- Preferencia: `<select>` nativo.
- Label: `¿Qué necesitas resolver?`.
- `name`: `problemType`.
- Placeholder inicial: `Selecciona una opción`.

Debe reutilizar las categorías de Spec 016 y M05. No inventar nuevas categorías.

### 5.6 Cuéntame tu problema

- Obligatorio.
- Tipo: `textarea`.
- Label: `Cuéntame tu problema`.
- `name`: `message`.
- `maxlength`: `2000`.
- Helper text exacto:

```text
Cuéntame brevemente qué ocurre hoy, qué quieres mejorar o qué resultado esperas conseguir. No necesitas tener definida la solución técnica.
```

### 5.7 Privacidad

- Obligatorio.
- Checkbox real.
- `name`: `privacyAccepted`.
- No marcar por defecto.
- Copy:

```text
He leído y acepto la Política de Privacidad.
```

`Política de Privacidad` debe enlazar a:

```text
/privacidad
```

### 5.8 Honeypot

Campo invisible para usuarios reales.

- Nombre conceptual: `website`.
- Tipo recomendado: `text`.
- `name`: `website`.
- `tabindex="-1"`.
- `autocomplete="off"`.
- Debe ocultarse de forma que no sea focusable ni anunciado como campo relevante.
- No debe usar `display: none` si eso impide estrategias antispam futuras basadas en bots simples; preferir clase visualmente oculta y `aria-hidden="true"` si se mantiene fuera del árbol accesible.

No usar CAPTCHA en V1.

## 6. Categorías `problemType`

Usar exactamente estas opciones y en este orden:

1. `Automatizar un proceso`
2. `Crear una aplicación`
3. `Conectar sistemas`
4. `Trabajar con mis datos`
5. `Mejorar infraestructura`
6. `Mejorar calidad`
7. `Mejorar monitoreo / visibilidad`
8. `No estoy seguro`
9. `Otro`

Estas categorías deben coincidir con Spec 016. El selector visual M05 hoy no incluye `Otro`, pero el formulario sí debe incluirlo porque captura necesidades que no aparezcan en el sitio.

## 7. Preselección desde M05

El selector actual conoce la opción activa mediante botones con `data-problem-option` y estado `aria-pressed`.

La implementación futura debe reutilizar ese estado para preseleccionar `problemType` en el formulario.

Flujo conceptual:

```text
Usuario selecciona "Conectar sistemas"
        ↓
Llega al formulario
        ↓
El select "¿Qué necesitas resolver?" queda en "Conectar sistemas"
```

Mapping recomendado:

| M05 key | Form value |
| --- | --- |
| `automation` | `Automatizar un proceso` |
| `app` | `Crear una aplicación` |
| `integration` | `Conectar sistemas` |
| `data` | `Trabajar con mis datos` |
| `infrastructure` | `Mejorar infraestructura` |
| `quality` | `Mejorar calidad` |
| `monitoring` | `Mejorar monitoreo / visibilidad` |
| `unsure` | `No estoy seguro` |

Si no existe selección previa, el select debe mostrar:

```text
Selecciona una opción
```

No crear un segundo sistema de categorías. El mapping debe vivir cerca de la lógica existente del selector o en una constante compartida pequeña dentro de `assets/js/main.js`.

## 8. Source y `sourceContext`

M18 debe quedar preparado para enviar en el futuro:

```text
source = website
```

Valores permitidos de `sourceContext`:

- `hero`
- `problem-selector`
- `poc`
- `final-cta`
- `form`

No implementar analytics.

Estrategia recomendada:

- incluir inputs hidden futuros para `source` y `sourceContext`, o prepararlos conceptualmente en JS;
- valor base: `source="website"`;
- valor inicial de `sourceContext`: `form`;
- si el usuario llega desde el selector y se preselecciona `problemType`, puede usarse `problem-selector` como contexto futuro.

No agregar tracking adicional, UTM internos ni identificadores persistentes.

## 9. Honeypot

El honeypot debe estar presente para preparar antispam básico sin afectar usuarios reales.

Requisitos:

- no visible para usuarios reales;
- no focusable;
- no requerido;
- no anunciado como campo relevante por lectores de pantalla;
- nombre conceptual `website`;
- si llega con valor en backend futuro, M19/M20 podrán rechazar o descartar el lead según política backend.

M18 no implementa rechazo backend porque no existe envío real.

## 10. Estados UI

La spec define estos estados para la implementación futura.

### Idle

Formulario editable.

Botón:

```text
Enviar mi caso
```

### Sending

Estado futuro cuando exista backend.

- botón temporalmente deshabilitado;
- texto:

```text
Enviando...
```

### Success

Mostrar solo cuando M19/M20 respondan OK después de validar y procesar el lead.

Mensaje recomendado:

```text
Gracias. Recibimos tu mensaje y revisaremos el caso para definir el siguiente paso.
```

### Error

Mensaje recomendado:

```text
No pudimos enviar tu mensaje. Intenta nuevamente o utiliza otro canal de contacto.
```

No afirmar recepción si Lambda, DynamoDB, SES o validación fallan.

## 11. Estado transitorio sin backend

M18 todavía no tiene backend. Por lo tanto, no debe simular envío exitoso.

Decisión para implementación M18:

- construir el formulario completo;
- habilitar validación frontend;
- interceptar `submit` con JavaScript;
- si el formulario es válido, mostrar un mensaje honesto de disponibilidad futura:

```text
El formulario estará disponible próximamente. Mientras tanto puedes contactarme por WhatsApp.
```

Esta opción genera menos confusión que un botón deshabilitado permanente porque permite probar accesibilidad, validación y layout sin fingir que los datos fueron enviados.

Reglas:

- no mostrar mensaje de éxito real;
- no limpiar el formulario como si se hubiese enviado;
- no enviar datos a ningún endpoint;
- no usar `mailto:`;
- no crear `action` remoto falso.

## 12. Validación frontend

La validación frontend debe incluir:

- `required` en `name`, `email`, `problemType`, `message` y `privacyAccepted`;
- trim de strings antes de validar;
- email válido usando `type="email"` y validación complementaria si hace falta;
- `maxlength` en campos de texto;
- teléfono opcional;
- `problemType` debe pertenecer a las categorías permitidas;
- privacidad obligatoria;
- honeypot sin validación visible.

La validación frontend no reemplaza la validación backend.

## 13. Mensajes de error

Los errores deben ser específicos, próximos al campo, comprensibles y accesibles.

Mensajes recomendados:

```text
Ingresa tu nombre.
Ingresa un email válido.
Selecciona qué necesitas resolver.
Cuéntame brevemente tu problema.
Debes aceptar la Política de Privacidad para continuar.
```

Reglas:

- asociar mensajes al campo con `aria-describedby` cuando corresponda;
- no depender solo de color rojo;
- usar borde, texto y estado claro;
- no mostrar un bloque genérico si puede indicarse el campo exacto;
- el resumen global es opcional, pero no debe reemplazar errores por campo.

## 14. Progressive enhancement

El formulario debe seguir siendo comprensible sin JavaScript.

Como M18 no tiene backend:

- no usar `action` remoto falso;
- no apuntar a Lambda todavía;
- puede usarse `action="#contacto"` o no declarar `action` hasta M19;
- el copy visible debe indicar que WhatsApp sigue disponible como canal activo.

Cuando M19 esté operativo, `action` o la lógica `fetch` deberán evolucionar hacia la Lambda Function URL aprobada en Spec 016.

## 15. Accesibilidad

La implementación futura debe exigir:

- `<form>` semántico;
- `<label>` asociado a cada campo;
- `id` únicos;
- `name` definidos;
- `required` donde corresponda;
- `autocomplete` apropiado;
- `aria-describedby` para helper/error text cuando aporte claridad;
- mensajes de error asociados al campo;
- focus visible;
- orden de tab lógico;
- checkbox real;
- select nativo preferentemente;
- botón real;
- no usar placeholders como labels;
- honeypot no focusable y no relevante para lectores de pantalla;
- no usar `aria-live` indiscriminadamente.

Puede usarse una región `aria-live="polite"` para mensaje global de disponibilidad/resultado si está justificado y no genera ruido.

## 16. Diseño

Mantener la identidad visual actual:

- dark;
- elegante;
- minimalista;
- premium;
- bordes finos;
- buen espacio negativo;
- sin formulario tipo SaaS genérico.

Decisión de layout recomendada:

- conservar el CTA final actual como entrada principal;
- agregar debajo un bloque de formulario con superficie contenida y borde sutil;
- en desktop, usar dos columnas dentro del bloque si aporta claridad:
  - izquierda: explicación breve, WhatsApp como fallback y recordatorio de Agenda pendiente;
  - derecha: formulario;
- en mobile, una columna con formulario después del texto.

No usar modal ni cards anidadas. Si se usa una superficie diferenciada, debe ser un contenedor de sección, no una card dentro de otra card.

## 17. Responsive

Mobile first.

### Mobile

- una columna;
- campos a ancho completo;
- labels visibles;
- targets cómodos;
- mensajes de error legibles;
- sin overflow horizontal.

### Desktop

- ancho de lectura controlado;
- posible layout 40/60 o dos columnas equilibradas;
- formulario cómodo sin parecer denso;
- suficiente espacio entre grupos.

Usar breakpoints existentes alrededor de `48rem` y `64rem` si se requieren.

## 18. Botón

Texto exacto:

```text
Enviar mi caso
```

No usar:

- `Enviar`;
- `Submit`;
- `Cotizar ahora`;
- `Comprar`;
- `Solicitar presupuesto gratis`.

El botón debe sentirse conversacional y coherente con la promesa de evaluación inicial.

## 19. WhatsApp fallback

El formulario debe convivir con WhatsApp como canal activo.

Texto sugerido:

```text
¿Prefieres conversar directamente? Háblanos por WhatsApp.
```

Debe enlazar al WhatsApp ya conectado en M17, reutilizando el mismo número aprobado y un mensaje breve. No repetir demasiados CTA ni competir con la jerarquía principal.

## 20. Agenda pendiente

Agenda sigue pendiente para M21.

M18 puede mantener el CTA visible existente `Agenda hoy mismo`, pero no debe conectarlo a agenda real ni a WhatsApp.

Reglas:

- no implementar Calendar;
- no implementar Meet;
- no simular reserva;
- no cambiar el propósito de Agenda.

## 21. Privacidad

El checkbox debe enlazar a:

```text
/privacidad
```

Al implementar el formulario productivo, `/privacidad` deberá actualizarse para reflejar tratamiento de:

- nombre;
- email;
- teléfono opcional;
- empresa;
- mensaje;
- tipo de problema;
- fecha/hora de recepción;
- metadatos técnicos mínimos si se guardan.

M18 no debe modificar `/privacidad` si el formulario no envía datos reales.

## 22. Destino operativo futuro

Para V1, las notificaciones de nuevos leads se enviarán inicialmente a:

```text
jonathan.valdes.o@gmail.com
```

Este correo es un destino operativo temporal.

Reglas:

- no mostrar este correo públicamente en la landing;
- no usarlo como branding del sitio;
- no conectarlo en M18;
- no usar `mailto:`;
- documentarlo solo como destino futuro de notificación backend.

Más adelante podrá migrarse a:

```text
info@jonathanvaldes.com
```

cuando se implemente correo corporativo.

## 23. Adjuntos fuera de alcance

Decisión V1:

- no input file;
- no adjuntos;
- no PDF;
- no imágenes;
- no S3;
- no presigned URLs;
- no archivos por email;
- no uploads.

Si el caso requiere documentación, se pedirá después del primer contacto por un canal acordado.

## 24. Antispam

Preparar frontend para:

- honeypot;
- `maxlength`;
- prevención futura de doble submit;
- validación de campos obligatorios;
- mensajes claros.

No implementar CAPTCHA en V1 salvo que exista abuso real.

La protección real se completará en backend/hardening con validación server-side, límites de payload, CORS, rate limiting si aplica y logs básicos.

## 25. Archivos previstos

La implementación futura probablemente modificará:

```text
index.html
assets/css/sections.css
assets/js/main.js
specs/018-contact-form-frontend.md
```

`assets/css/components.css` solo si aparece un patrón reusable real para campos de formulario o mensajes de error.

No debería modificar:

- backend;
- infraestructura;
- Terraform;
- páginas legales;
- dependencias;
- specs futuras.

## 26. Fuera de alcance

No implementar en M18:

- Lambda;
- Function URL;
- DynamoDB;
- SES;
- envío real;
- Gmail API;
- `mailto:`;
- archivos;
- S3;
- presigned URLs;
- agenda;
- Google Calendar;
- Meet;
- CAPTCHA;
- analytics;
- backend;
- deploy;
- M19.

## 27. Riesgos / deuda

- Un formulario visible sin backend puede confundir si no se comunica claramente el estado transitorio.
- Si se intercepta submit, debe evitarse cualquier mensaje que parezca éxito real.
- La preselección desde M05 requiere no duplicar categorías ni crear estado paralelo innecesario.
- `/privacidad` debe actualizarse antes del envío productivo real.
- El destino operativo `jonathan.valdes.o@gmail.com` queda documentado, pero no debe exponerse en frontend.
- El backend deberá validar todo nuevamente; la validación frontend solo mejora UX.
- Agenda seguirá pendiente hasta M21.
- Honeypot ayuda, pero no sustituye controles backend.

## 28. Criterios de aceptación

La implementación futura de M18 se considera aceptada si:

- el formulario se ubica dentro o inmediatamente después de `#contacto`;
- mantiene WhatsApp como principal, Agenda como secundaria y formulario como alternativa;
- incluye 7 campos visibles más honeypot;
- usa exactamente las categorías `problemType` aprobadas;
- permite preseleccionar `problemType` desde M05;
- muestra placeholder `Selecciona una opción` si no hay selección previa;
- incluye privacidad obligatoria con enlace a `/privacidad`;
- no incluye adjuntos;
- no incluye presupuesto obligatorio ni campos invasivos;
- define y aplica validación frontend;
- muestra errores específicos y accesibles;
- define estados Idle, Sending, Success y Error;
- en M18 no simula envío exitoso antes de M19;
- muestra estado transitorio honesto si el usuario intenta enviar;
- mantiene WhatsApp como fallback;
- Agenda permanece pendiente;
- documenta `jonathan.valdes.o@gmail.com` como destino operativo futuro;
- no expone ese Gmail públicamente;
- no conecta backend, SES, DynamoDB ni Lambda;
- no agrega dependencias;
- no implementa M19.

## 29. Validaciones mínimas para implementación futura

Cuando M18 se implemente, ejecutar solo validaciones rápidas:

- `git status --short --branch` antes de modificar;
- verificar ubicación en `#contacto`;
- verificar 7 campos visibles más honeypot;
- verificar labels, ids y names;
- verificar categorías exactas de `problemType`;
- verificar preselección desde selector M05;
- verificar privacidad obligatoria y enlace `/privacidad`;
- verificar ausencia de adjuntos;
- verificar ausencia de backend, Lambda, SES, DynamoDB, Gmail API y `mailto:`;
- verificar que no se muestra success falso;
- verificar errores por campo;
- verificar accesibilidad básica con teclado;
- `node --check assets/js/main.js` si se modifica JS;
- `git diff --check`;
- revisión responsive básica;
- sin Lighthouse;
- sin deploy.