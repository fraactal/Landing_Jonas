# Spec 017 - WhatsApp Contact

Estado: Implementada.

Esta spec define como conectar los CTA comerciales de `jonathanvaldes.com` con WhatsApp Business mediante enlaces `wa.me`, sin implementar todavia HTML, CSS, JavaScript, backend, formulario, agenda ni deploy.

## 1. Objetivo

Convertir los CTA comerciales principales de la landing en conversaciones reales por WhatsApp Business, manteniendo baja friccion y mensajes breves con contexto suficiente para iniciar una conversacion comercial cualificada.

La implementacion futura debe:

- abrir WhatsApp con un mensaje prellenado y editable por el usuario;
- usar el numero aprobado sin inventar otro;
- reutilizar el problema seleccionado cuando exista;
- funcionar en mobile y desktop;
- no depender de backend;
- no implementar WhatsApp API, tokens, SDK ni librerias externas;
- mantener Agenda fuera de WhatsApp hasta el modulo correspondiente.

## 2. Contexto

La landing ya esta cerrada como frontend estatico con CTA placeholders hacia `#contacto`.

CTA actuales auditados en `index.html`:

- Navbar: `Agenda hoy mismo` y `Háblanos hoy`.
- Hero: `Háblanos hoy` y `Agenda hoy mismo`.
- Selector de problemas: `Cuéntame tu caso`.
- Demo / PoC: `Evaluar mi proyecto`.
- CTA final: `Háblanos hoy` y `Agenda hoy mismo`.
- Footer: `WhatsApp` y `Email` como canales mostrados en texto.

Spec 016 define WhatsApp como canal principal, Agenda como canal secundario y Formulario como alternativa. M17 solo conecta WhatsApp mediante deep-links `wa.me`; no implementa agenda, formulario, backend ni analytics.

## 3. Numero aprobado

Numero aprobado para WhatsApp Business:

```text
+56 9 3136 7372
```

Formato tecnico para `wa.me`:

```text
56931367372
```

No usar ni documentar otro numero en la implementacion futura.

## 4. Formato `wa.me`

Base aprobada:

```text
https://wa.me/56931367372
```

Formato con mensaje prellenado:

```text
https://wa.me/56931367372?text=<mensaje-URL-encoded>
```

Los mensajes deben codificarse correctamente para URL. El usuario debe poder editar el texto antes de enviarlo dentro de WhatsApp.

## 5. CTA cubiertos

M17 debe conectar a WhatsApp estos CTA:

1. Hero `Háblanos hoy`.
2. Selector de problemas `Cuéntame tu caso`.
3. Demo / PoC `Evaluar mi proyecto`.
4. CTA final `Háblanos hoy`.
5. Footer `WhatsApp`.

La implementacion futura puede conectar tambien el `Háblanos hoy` del Navbar al mismo mensaje general del Hero o del CTA final, siempre que no cambie el copy visible ni agregue variantes innecesarias.

No conectar en M17:

- `Agenda hoy mismo` del Navbar;
- `Agenda hoy mismo` del Hero;
- `Agenda hoy mismo` del CTA final;
- `Email` del Footer.

## 6. Mensaje Hero

CTA visible:

```text
Háblanos hoy
```

Mensaje exacto:

```text
Hola Jonathan, vi tu sitio y quiero conversar sobre un problema tecnológico en mi empresa.
```

Destino conceptual:

```text
https://wa.me/56931367372?text=Hola%20Jonathan%2C%20vi%20tu%20sitio%20y%20quiero%20conversar%20sobre%20un%20problema%20tecnol%C3%B3gico%20en%20mi%20empresa.
```

## 7. Mensaje Selector

CTA visible:

```text
Cuéntame tu caso
```

Debe usar el `problemType` seleccionado cuando exista una opcion activa.

Plantilla base:

```text
Hola Jonathan, quiero conversar sobre [problemType] en mi empresa.
```

Ejemplo:

```text
Hola Jonathan, quiero conversar sobre automatizar un proceso en mi empresa.
```

Si el usuario pulsa el CTA sin haber seleccionado una opcion, la implementacion debe usar un mensaje general seguro:

```text
Hola Jonathan, vi tu sitio y quiero conversar sobre un problema tecnológico en mi empresa.
```

No generar frases incomodas como:

```text
quiero conversar sobre No estoy seguro
```

## 8. Mapeo `problemType -> mensaje`

La implementacion futura debe mapear las opciones actuales del selector a frases naturales.

| Clave actual | Label visible | Frase natural | Mensaje WhatsApp |
| --- | --- | --- | --- |
| `automation` | `Automatizar un proceso` | `automatizar un proceso` | `Hola Jonathan, quiero conversar sobre automatizar un proceso en mi empresa.` |
| `app` | `Crear una aplicación` | `crear una aplicación` | `Hola Jonathan, quiero conversar sobre crear una aplicación en mi empresa.` |
| `integration` | `Conectar sistemas` | `conectar sistemas` | `Hola Jonathan, quiero conversar sobre conectar sistemas en mi empresa.` |
| `data` | `Trabajar con mis datos` | `trabajar con mis datos` | `Hola Jonathan, quiero conversar sobre trabajar con mis datos en mi empresa.` |
| `infrastructure` | `Mejorar infraestructura` | `mejorar infraestructura` | `Hola Jonathan, quiero conversar sobre mejorar infraestructura en mi empresa.` |
| `quality` | `Mejorar calidad` | `mejorar calidad` | `Hola Jonathan, quiero conversar sobre mejorar calidad en mi empresa.` |
| `monitoring` | `Mejorar monitoreo / visibilidad` | `mejorar monitoreo o visibilidad` | `Hola Jonathan, quiero conversar sobre mejorar monitoreo o visibilidad en mi empresa.` |
| `unsure` | `No estoy seguro` | caso especial | `Hola Jonathan, tengo un problema tecnológico en mi empresa pero todavía no tengo claro qué tipo de solución necesito.` |
| `other` | `Otro` | caso especial futuro | `Hola Jonathan, quiero conversar sobre una necesidad tecnológica que no aparece entre las opciones del sitio.` |

Nota: el selector actual de M05 no muestra `Otro`. La arquitectura de leads de Spec 016 si lo contempla para formulario. M17 debe documentar el mensaje de `Otro` para consistencia futura, pero no debe agregar esa opcion al selector en esta implementacion.

## 9. Mensaje PoC

CTA visible:

```text
Evaluar mi proyecto
```

Mensaje exacto:

```text
Hola Jonathan, quiero evaluar si mi proyecto puede validarse primero con una prueba de concepto.
```

Destino conceptual:

```text
https://wa.me/56931367372?text=Hola%20Jonathan%2C%20quiero%20evaluar%20si%20mi%20proyecto%20puede%20validarse%20primero%20con%20una%20prueba%20de%20concepto.
```

## 10. Mensaje CTA final

CTA visible:

```text
Háblanos hoy
```

Mensaje recomendado exacto:

```text
Hola Jonathan, vi tu sitio y quiero conversar sobre una solución tecnológica para mi empresa.
```

Destino conceptual:

```text
https://wa.me/56931367372?text=Hola%20Jonathan%2C%20vi%20tu%20sitio%20y%20quiero%20conversar%20sobre%20una%20soluci%C3%B3n%20tecnol%C3%B3gica%20para%20mi%20empresa.
```

## 11. Mensaje Footer

Elemento visible actual:

```text
WhatsApp
```

En M17 debe transformarse en enlace real al mismo numero aprobado.

Decision: usar mensaje breve prellenado para mantener contexto comercial y evitar abrir un chat vacio.

Mensaje exacto:

```text
Hola Jonathan, encontré tu sitio y quiero conversar sobre un proyecto o problema tecnológico.
```

Destino conceptual:

```text
https://wa.me/56931367372?text=Hola%20Jonathan%2C%20encontr%C3%A9%20tu%20sitio%20y%20quiero%20conversar%20sobre%20un%20proyecto%20o%20problema%20tecnol%C3%B3gico.
```

## 12. Agenda fuera de alcance

`Agenda hoy mismo` no debe conectarse a WhatsApp en M17.

Debe permanecer pendiente para M21 y tendra un destino distinto asociado al flujo de agenda aprobado en Spec 016.

Reglas:

- no convertir `Agenda hoy mismo` en WhatsApp;
- no usar el mismo deep-link de WhatsApp para agenda;
- no implementar Google Calendar ni Meet;
- no simular una reserva disponible;
- mantener destino temporal controlado hasta el modulo de agenda.

## 13. Estrategia tecnica

Usar solamente enlaces `wa.me`.

No usar:

- WhatsApp Business API;
- Meta Cloud API;
- tokens;
- SDK;
- backend;
- Lambda;
- DynamoDB;
- SES;
- librerias externas;
- dependencias nuevas.

La implementacion debe ser compatible con el frontend estatico actual.

## 14. URL encoding

Estrategia aprobada:

- CTA estaticos: escribir `href` con el mensaje ya URL-encoded o generar una constante simple si se centraliza en JS por necesidad.
- Selector dinamico: construir el `href` con JavaScript usando `encodeURIComponent`.

Preferencia de implementacion:

1. Para Hero, PoC, CTA final y Footer, usar enlaces directos con `href` codificado.
2. Para el selector, ampliar el bloque existente de M05 para actualizar el `href` del CTA `Cuéntame tu caso` segun la opcion activa.
3. Evitar duplicar logica de estado del selector.

Los mensajes no deben incluir datos sensibles ni parametros de tracking invasivos.

## 15. Reutilizacion del estado del selector

La implementacion actual de M05 usa botones con `data-problem-option` y un objeto `problemContent` en `assets/js/main.js`.

M17 debe reutilizar esa informacion o el valor activo del boton seleccionado. No debe crear un segundo sistema de estado paralelo si el selector ya conoce la opcion activa.

Estrategia recomendada:

- agregar a cada entrada de `problemContent` una propiedad pequena para el mensaje o frase natural de WhatsApp;
- al ejecutar `setSelectedProblem(selectedButton)`, calcular el mensaje contextual;
- actualizar `problemDetailCta.href` con `https://wa.me/56931367372?text=${encodeURIComponent(message)}`;
- quitar cualquier dependencia de `#contacto` para ese CTA cuando ya exista seleccion;
- mantener un fallback general si no hay seleccion.

No construir contenido esencial dinamicamente fuera del comportamiento ya existente del selector.

## 16. Source context futuro

No implementar analytics en M17.

La spec documenta estos contextos comerciales conceptuales:

- `hero`;
- `problem-selector`;
- `poc`;
- `final-cta`;
- `footer`.

No es necesario enviar `sourceContext` visible en el mensaje de WhatsApp.

No agregar parametros UTM, tracking invasivo ni identificadores persistentes en los links de WhatsApp durante M17.

## 17. Accesibilidad

Los enlaces futuros deben:

- mantener el copy visible actual;
- ser enlaces reales cuando apuntan a WhatsApp;
- ser navegables por teclado;
- conservar focus visible existente;
- tener destino comprensible por su texto visible y contexto;
- no depender de iconos;
- no reemplazarse por `div` o elementos no semanticos;
- no romper la navegacion mobile ni el menu actual.

Si se usa `target="_blank"`, debe agregarse `rel="noopener noreferrer"`.

No agregar `aria-live` para WhatsApp. La actualizacion del CTA del selector ocurre como resultado directo de la seleccion del usuario.

## 18. Responsive

M17 no deberia requerir cambios importantes de layout.

La implementacion futura debe verificar en mobile y desktop:

- Hero `Háblanos hoy`;
- selector `Cuéntame tu caso`;
- PoC `Evaluar mi proyecto`;
- CTA final `Háblanos hoy`;
- Footer `WhatsApp`.

Los enlaces deben conservar area tactil y wrapping correcto. No debe generarse overflow horizontal.

## 19. Seguridad de links externos

Evaluar uso de:

```html
target="_blank"
rel="noopener noreferrer"
```

Decision recomendada:

- usar `target="_blank"` para enlaces WhatsApp porque salen del sitio hacia un servicio externo;
- incluir siempre `rel="noopener noreferrer"` junto a `target="_blank"`;
- aceptar que algunos navegadores o sistemas operativos manejen el deep-link abriendo app nativa o WhatsApp Web.

No depender de que siempre se abra una pestaña nueva.

## 20. Fallback WhatsApp Web

Si WhatsApp no esta instalado, el enlace `wa.me` debe permitir que el navegador continue hacia WhatsApp Web cuando corresponda.

No implementar:

- deteccion custom de app instalada;
- mensajes de error inventados;
- modales de fallback;
- branching por dispositivo;
- redirecciones con JavaScript.

El fallback debe quedar delegado al comportamiento estandar de `wa.me`.

## 21. Privacidad

El deep-link de WhatsApp implica que el usuario interactua con un servicio externo de Meta/WhatsApp.

Antes de produccion final, la politica de privacidad deberia reflejar que:

- el usuario puede contactar mediante WhatsApp;
- el canal se rige tambien por las condiciones y politicas de Meta/WhatsApp;
- el mensaje enviado puede incluir voluntariamente contexto del problema;
- el sitio no envia datos a backend propio al hacer click en M17.

M17 no debe actualizar `/privacidad` salvo instruccion explicita durante su implementacion. La actualizacion legal puede quedar para un modulo posterior de privacidad/hardening si se decide no mezclarla con la conexion del CTA.

## 22. Archivos previstos

La implementacion futura probablemente modificara:

```text
index.html
assets/js/main.js
specs/017-whatsapp-contact.md
```

CSS no deberia ser necesario. Solo modificar CSS si aparece una necesidad real y acotada, por ejemplo preservar foco visible o layout de Footer al convertir `WhatsApp` en enlace.

No modificar en M17:

- backend;
- infraestructura;
- Terraform;
- paginas legales, salvo instruccion explicita;
- documentos de fase aprobados;
- specs futuras;
- dependencias.

## 23. Fuera de alcance

No implementar en M17:

- WhatsApp Cloud API;
- Meta Cloud API;
- webhook;
- bot;
- respuestas automaticas;
- CRM;
- formulario;
- Lambda;
- SES;
- DynamoDB;
- Agenda;
- Google Calendar;
- Meet;
- analytics;
- backend;
- deploy;
- push;
- merge;
- Spec 018.

## 24. Riesgos / deuda

- Los links `wa.me` dependen del comportamiento de WhatsApp/Meta y del navegador del usuario.
- `target="_blank"` puede no comportarse igual en todos los dispositivos, pero `wa.me` mantiene fallback razonable.
- El selector debe actualizar el `href` sin duplicar estado ni romper el panel contextual de M05.
- Si el usuario no selecciona un problema, el CTA debe usar un mensaje general para evitar contexto incorrecto.
- `Otro` queda documentado por consistencia con Spec 016, pero no existe aun en el selector visual.
- La politica de privacidad debe revisarse antes de produccion final si WhatsApp queda como canal activo.
- Agenda seguira pendiente y no debe confundirse con WhatsApp.
- No habra medicion de clicks en M17; analytics queda para modulo posterior.

## 25. Criterios de aceptacion

La implementacion futura de M17 se considera aceptada si:

- usa exactamente el numero `56931367372`;
- Hero `Háblanos hoy` apunta conceptualmente a WhatsApp;
- selector `Cuéntame tu caso` genera mensaje contextual segun el `problemType` seleccionado;
- selector usa mensaje especial para `No estoy seguro`;
- el caso futuro `Otro` queda contemplado sin agregarlo al selector actual;
- PoC `Evaluar mi proyecto` usa su mensaje especifico;
- CTA final `Háblanos hoy` usa su mensaje especifico;
- Footer `WhatsApp` queda definido como enlace real con mensaje breve prellenado;
- `Agenda hoy mismo` no se conecta a WhatsApp;
- no usa backend;
- no usa WhatsApp API;
- no usa tokens;
- no agrega dependencias;
- define y aplica encoding correcto;
- conserva accesibilidad de enlaces y CTA;
- incluye `rel="noopener noreferrer"` si usa `target="_blank"`;
- documenta impacto de privacidad;
- no implementa formulario;
- no implementa agenda;
- no implementa analytics;
- no implementa M18.

## 26. Validaciones minimas para implementacion futura

Cuando M17 se implemente, ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- verificar numero `56931367372`;
- verificar enlaces `wa.me`;
- verificar mensajes exactos de Hero, selector, PoC, CTA final y Footer;
- verificar encoding de URLs;
- verificar `target="_blank"` y `rel="noopener noreferrer"` si corresponde;
- verificar que `Agenda hoy mismo` no apunta a WhatsApp;
- verificar que no se agrego backend, API, tokens ni dependencias;
- verificar que no se modifico CSS salvo necesidad justificada;
- `node --check assets/js/main.js` si se modifica JS;
- `git diff --check`;
- revision responsive basica mobile/desktop;
- sin Lighthouse;
- sin deploy.