# Spec 008 - PoC Section

## Estado

Implementada.

Esta spec define la seccion comercial `Demo / PoC` de `jonathanvaldes.com`. Fue implementada tras aprobacion explicita, sin JavaScript nuevo, dependencias, contacto real ni backend.

## 1. Objetivo

Definir una seccion de validacion comercial que explique que algunos problemas pueden validarse antes de comprometerse con un desarrollo completo.

La seccion debe transmitir:

- reduccion de riesgo;
- validacion tecnica;
- alcance acotado;
- decision informada;
- profesionalismo.

La seccion no debe transmitir:

- desarrollo gratis;
- MVP gratis;
- demo automatica;
- prueba gratuita para cualquiera;
- promesas antes de diagnosticar el problema.

La pregunta que debe responder es:

```text
¿Tengo que contratar un proyecto completo sin saber si funcionará?
```

Respuesta conceptual:

```text
No necesariamente. Cuando el caso lo permite, primero podemos validar una parte crítica.
```

## 2. Contexto

La Spec 006 implemento `Servicios`.

La Spec 007 implemento `Cómo trabajamos`, incluyendo el paso `Validamos`, donde se menciona que una PoC puede ser util cuando tiene sentido.

La Spec 008 debe profundizar esa idea sin convertirla en una oferta de trabajo gratuito. Fase 1 y Fase 3 establecen que la demo o PoC es una herramienta de validacion tecnica acotada, sujeta a evaluacion, y no representa el producto final.

Fase 4 define esta seccion como un bloque visual destacado con el titulo `Valida antes de construir`, el flujo `IDEA → PoC → VALIDACIÓN → PROYECTO` y el CTA `Evaluar mi proyecto`.

## 3. Ubicacion

La seccion debe aparecer inmediatamente despues de `Cómo trabajamos` y antes de `Casos / ejemplos`.

Orden esperado:

```text
Cómo trabajamos
↓
Demo / PoC
↓
Casos / ejemplos
```

En la implementacion futura, la seccion debe quedar dentro de `<main>` despues de `.process`.

## 4. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real `Demo / PoC`;
- ubicarla inmediatamente despues de `Cómo trabajamos`;
- usar el titulo aprobado `Valida antes de construir`;
- incluir el copy aprobado o una version con ajustes minimos de ritmo;
- mostrar el flujo visual `IDEA → PoC → VALIDACIÓN → PROYECTO`;
- incluir el CTA `Evaluar mi proyecto`;
- mantener el CTA como placeholder controlado;
- usar HTML y CSS, sin JavaScript nuevo salvo necesidad excepcional justificada;
- reutilizar tokens y componentes existentes;
- mantener responsive mobile first;
- mantener accesibilidad y buen contraste;
- evitar lenguaje de gratuidad o urgencia falsa;
- no agregar dependencias, imagenes ni librerias.

## 5. Fuera de alcance

No forma parte de esta spec:

- casos;
- proyectos;
- About / Sobre mi;
- FAQ;
- CTA final;
- Footer;
- contacto real;
- WhatsApp real;
- formularios;
- agenda real;
- analytics;
- backend;
- paginas legales;
- `/cv`;
- pricing;
- badges tipo `gratis`;
- descuentos;
- cuenta regresiva;
- urgencia falsa;
- Spec 009 o cualquier seccion posterior.

## 6. Titulo

Usar el titulo aprobado:

```text
Valida antes de construir
```

No usar titulos que prometan una demo automatica o gratuita.

## 7. Copy

Copy base aprobado:

```text
Algunos problemas pueden validarse antes de iniciar un desarrollo mayor.
```

```text
Cuando tiene sentido técnicamente, podemos definir una prueba de concepto acotada para comprobar una integración, automatización, flujo de datos, dashboard, API o prototipo.
```

```text
Su alcance se acuerda después de entender el problema y no representa el desarrollo completo del producto.
```

Copy final propuesto para implementacion:

```text
Algunos problemas pueden validarse antes de iniciar un desarrollo mayor.

Cuando tiene sentido técnicamente, podemos definir una prueba de concepto acotada para comprobar una integración, automatización, flujo de datos, dashboard, API o prototipo.

Su alcance se acuerda después de entender el problema y no representa el desarrollo completo del producto.
```

Se permiten ajustes minimos de saltos de linea o agrupacion, pero no cambiar el significado.

## 8. Flujo visual

El flujo visual aprobado es:

```text
IDEA → PoC → VALIDACIÓN → PROYECTO
```

Puede resolverse con:

- HTML;
- CSS;
- SVG inline ligero si aporta valor.

Requisitos:

- simple y legible;
- horizontal en desktop si el espacio lo permite;
- vertical o wrap controlado en mobile;
- sin librerias;
- sin imagenes;
- sin logos;
- sin canvas ni WebGL;
- sin animacion continua.

El flujo debe tener equivalente textual para lectores de pantalla. Si el grafico es decorativo, usar `aria-hidden="true"` y agregar una frase accesible estable con el flujo completo.

## 9. CTA

Texto exacto:

```text
Evaluar mi proyecto
```

Comportamiento en M08:

- placeholder controlado;
- no conectar a WhatsApp real;
- no conectar a formulario real;
- no conectar a agenda real;
- no conectar a backend;
- no inventar telefono, correo ni URL externa.

Destino temporal recomendado:

```text
#contacto-pendiente
```

La implementacion futura debe dejar documentado que este CTA se conectara a un flujo real de contacto/evaluacion en una spec posterior.

## 10. Diseño

La seccion debe romper ligeramente el ritmo visual de la landing sin parecer una promocion.

Puede usar:

- superficie destacada;
- borde fino;
- acento controlado;
- composicion contenida;
- flujo visual como apoyo;
- CTA visible pero no agresivo.

No usar:

- pricing;
- badges tipo `gratis`;
- descuentos;
- cuenta regresiva;
- urgencia falsa;
- iconos promocionales;
- lenguaje de oferta limitada.

La sensacion buscada es: validacion profesional, acotada y proporcional al problema.

## 11. Layout

### Mobile

- una columna;
- texto primero;
- flujo visual despues;
- CTA al final;
- buen espacio vertical;
- sin overflow horizontal;
- evitar que el flujo se comprima demasiado.

### Desktop

- bloque destacado;
- copy y flujo visual equilibrados;
- suficiente espacio;
- CTA claramente visible;
- flujo visual preferentemente horizontal;
- mantener coherencia con el dark mode y las secciones anteriores.

La seccion puede usar una composicion de dos columnas si mejora la lectura: copy/CTA a un lado, flujo visual al otro. Tambien puede usar un bloque central contenido si se siente mas claro.

## 12. Accesibilidad

La implementacion futura debe incluir:

- seccion semantica con heading propio;
- heading asociado mediante `aria-labelledby` si corresponde;
- CTA como enlace real si navega a un placeholder interno;
- foco visible en el CTA;
- flujo visual con equivalente textual;
- grafico decorativo con `aria-hidden="true"` si no aporta informacion adicional;
- no depender solo del color para comunicar avance o jerarquia;
- contraste suficiente;
- no ocultar contenido esencial;
- copy completo visible en el DOM.

No se requiere `aria-live`, controles dinamicos ni estados interactivos complejos.

## 13. Microinteracciones

Permitido:

- borde/acento sutil;
- hover discreto en CTA mediante estilos existentes;
- transicion leve de superficie o borde;
- microinteraccion no continua si aporta pulido visual.

No usar:

- animacion continua;
- parpadeos;
- movimiento fuerte;
- zoom agresivo;
- carruseles;
- modales;
- efectos 3D.

Con `prefers-reduced-motion: reduce`, evitar transformaciones innecesarias.

## 14. Responsive

Enfoque obligatorio: mobile first.

La implementacion futura debe:

- partir en una columna;
- permitir que el flujo visual haga wrap o se apile;
- evitar textos cortados;
- evitar overflow horizontal;
- mantener CTA visible y tactilmente comodo;
- usar breakpoints existentes si hacen falta, especialmente alrededor de `48rem` y `64rem`.

No agregar breakpoints nuevos salvo necesidad concreta.

## 15. Performance

La seccion debe ser liviana.

Requisitos:

- idealmente sin JavaScript nuevo;
- sin dependencias;
- sin imagenes;
- sin fetch ni llamadas de red;
- sin canvas, WebGL ni video;
- SVG inline ligero solo si aporta valor;
- reutilizar `assets/css/sections.css`;
- reutilizar clases de boton existentes;
- evitar layout shifts.

M08 no deberia modificar `assets/js/main.js` salvo necesidad excepcional justificada.

## 16. Conversion

La seccion debe ayudar a convertir dudas en conversacion cualificada.

Mensaje central:

```text
No necesitas contratar un proyecto completo a ciegas. Cuando el caso lo permite, podemos validar una parte crítica antes de avanzar.
```

Reglas comerciales:

- no prometer PoC en todos los casos;
- no presentar la PoC como producto gratuito;
- no prometer resultados antes de entender el problema;
- no cotizar ni definir alcance dentro de la landing;
- reforzar que la decision viene despues de analizar el caso.

No agregar FAQ dentro de esta seccion.

## 17. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion aparezca inmediatamente despues de M07;
- exista el titulo `Valida antes de construir`;
- se use el copy aprobado;
- exista el flujo `IDEA → PoC → VALIDACIÓN → PROYECTO`;
- exista el CTA `Evaluar mi proyecto`;
- el CTA use placeholder controlado;
- no se conecte WhatsApp real, formulario, agenda ni backend;
- no exista lenguaje de gratuidad;
- no existan badges, descuentos, cuenta regresiva ni urgencia falsa;
- la seccion sea responsive;
- el flujo visual sea legible en mobile y desktop;
- la seccion sea accesible;
- el flujo visual tenga equivalente textual;
- no se agregue JavaScript nuevo salvo necesidad excepcional documentada;
- no se agreguen dependencias;
- no se agreguen imagenes;
- no se implemente Spec 009 ni secciones posteriores;
- no existan errores evidentes en una revision rapida.

## 18. Archivos previstos

La futura implementacion probablemente modificara:

```text
index.html
assets/css/sections.css
specs/008-poc-section.md
```

No deberia ser necesario modificar:

```text
assets/js/main.js
```

Modificar `assets/css/components.css` solo si aparece un patron reusable real.

No modificar en esta spec:

- `AGENTS.md`;
- documentos de fase aprobados;
- `assets/css/tokens.css`, salvo necesidad excepcional y documentada;
- `assets/css/base.css`, salvo necesidad excepcional y documentada;
- `/cv`;
- paginas legales;
- infraestructura;
- Terraform;
- configuraciones secretas;
- archivos legacy externos.

## 19. Riesgos / deuda tecnica

- La seccion puede interpretarse como oferta gratuita si el copy o el diseno usan lenguaje promocional.
- El CTA queda como placeholder hasta que exista un canal real de contacto/evaluacion.
- El flujo visual puede saturar mobile si se fuerza horizontalmente; debe apilarse o hacer wrap.
- Si se usa SVG, mantenerlo liviano y decorativo salvo que aporte informacion esencial.
- La seccion debe diferenciarse visualmente sin parecer anuncio ni pricing.
- Los anchors `#proyectos` y `#faq` del Navbar seguiran pendientes hasta sus specs correspondientes.
- Existe un detalle de formato HTML heredado al final de M07 que puede corregirse en una futura implementacion si toca el mismo bloque, pero no debe mezclarse con esta preparacion documental.

## 20. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues de M07;
- comprobar que no se implementa Casos ni Spec 009;
- verificar titulo `Valida antes de construir`;
- verificar copy aprobado;
- verificar flujo `IDEA → PoC → VALIDACIÓN → PROYECTO`;
- verificar CTA `Evaluar mi proyecto`;
- verificar CTA placeholder;
- verificar que no existe lenguaje de gratuidad;
- verificar que no hay WhatsApp real, formulario, agenda ni backend;
- revisar responsive basico mobile y desktop;
- revisar accesibilidad del flujo visual y CTA;
- verificar que no se agregaron dependencias ni imagenes;
- verificar que no se modifico `assets/js/main.js`, salvo excepcion justificada;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.
