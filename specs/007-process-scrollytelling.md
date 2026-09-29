# Spec 007 - Process Scrollytelling

## Estado

Implementada.

Esta spec define la seccion `Cómo trabajamos` de `jonathanvaldes.com`. Fue implementada tras aprobacion explicita, con fallback lineal en mobile y estado activo mediante `IntersectionObserver` en desktop.

## 1. Objetivo

Definir una seccion de proceso comercial y tecnico que muestre, de forma secuencial, como trabajamos desde la comprension del problema hasta el acompanamiento posterior.

La experiencia desktop debe usar un modelo de sticky scrollytelling sobrio, natural y accesible. La intencion es que el visitante perciba que existe un metodo claro antes de iniciar un proyecto, sin convertir la seccion en una presentacion forzada ni en una animacion pesada.

La seccion debe reforzar estas ideas:

- primero entendemos el problema;
- despues analizamos alternativas;
- validamos solo cuando tiene sentido;
- construimos con alcance claro;
- acompanamos cuando corresponde.

## 2. Contexto

La Spec 002 dejo la base visual y tecnica.

La Spec 003 implemento Navbar y Hero.

La Spec 004 implemento la seccion dinamica `¿Tu problema es...?`.

La Spec 005 implemento el selector interactivo `¿Qué necesitas resolver?`.

La Spec 006 implemento la seccion de Servicios con `id="soluciones"`.

Fase 3 y Fase 4 aprobaron `Cómo trabajamos` como la tercera interaccion visual principal de la landing. A diferencia de las secciones anteriores, esta puede usar sticky scrollytelling en desktop, pero debe conservar lectura lineal y accesible en mobile, pantallas pequenas, reduced motion o escenarios sin JavaScript.

## 3. Ubicacion

La seccion debe aparecer inmediatamente despues de Servicios y antes de Demo / PoC.

Orden esperado:

```text
Servicios
↓
Cómo trabajamos
↓
Demo / PoC
```

En la implementacion futura, la seccion debe quedar dentro de `<main>` despues de `.services`.

## 4. Anchor

La seccion debe usar el anchor estable:

```html
id="como-trabajamos"
```

El enlace `Cómo trabajamos` del Navbar debe apuntar a esta seccion y comenzar a funcionar cuando M07 se implemente.

No tocar otros anchors pendientes en este modulo.

## 5. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real titulada `Cómo trabajamos`;
- usar `id="como-trabajamos"`;
- ubicar la seccion inmediatamente despues de Servicios;
- mostrar exactamente siete pasos aprobados;
- mantener el orden aprobado;
- incluir todo el contenido de los pasos en el DOM;
- usar una lista ordenada semantica o estructura equivalente accesible;
- implementar un modelo sticky en desktop solo cuando exista ancho y alto suficiente;
- usar fallback lineal en mobile;
- contemplar reduced motion;
- evitar scroll hijacking;
- usar JavaScript minimo solo si es necesario para marcar el paso activo;
- preferir `IntersectionObserver` antes que listeners continuos de `scroll`;
- reutilizar `assets/js/main.js` si se requiere JS;
- reutilizar `assets/css/sections.css` para estilos;
- no agregar dependencias, imagenes pesadas, canvas ni WebGL.

## 6. Fuera de alcance

No forma parte de esta spec:

- Demo / PoC;
- casos;
- About / Sobre mi;
- FAQ;
- CTA final;
- Footer;
- contacto real;
- WhatsApp real;
- agenda real;
- analytics;
- backend;
- reservas;
- paginas legales;
- `/cv`;
- animaciones 3D;
- carruseles;
- sliders;
- parallax decorativo;
- librerias externas como GSAP, ScrollTrigger o Framer Motion;
- Spec 008 o cualquier seccion posterior.

## 7. Titulo e introduccion

### Titulo

```text
Cómo trabajamos
```

### Introduccion propuesta

```text
Un proceso claro para entender el problema, validar una solución y construir solo lo que realmente tiene sentido.
```

La introduccion debe ser breve. No debe transformarse en un parrafo largo ni repetir todo el proceso antes de mostrarlo.

## 8. Siete pasos y copy

Usar exactamente estos siete pasos, en este orden.

### 01 - Entendemos

```text
Cuéntanos qué ocurre hoy, cuál es el problema y qué resultado necesitas.
```

### 02 - Analizamos

```text
Revisamos procesos, sistemas existentes, restricciones y posibles alternativas.
```

### 03 - Proponemos

```text
Definimos una solución proporcional al problema.
```

### 04 - Validamos

```text
Cuando tiene sentido, construimos una pequeña PoC para validar la idea antes de desarrollar el proyecto completo.
```

### 05 - Definimos

```text
Si decidimos avanzar, acordamos alcance, entregables, plazos y costos.
```

### 06 - Construimos

```text
Implementamos de forma incremental y con objetivos claros.
```

### 07 - Acompañamos

```text
Cuando corresponde, agregamos soporte, monitoreo o nuevas etapas.
```

No cambiar el orden, los nombres ni el sentido del copy sin aprobacion explicita.

## 9. Modelo desktop sticky

En desktop, la seccion debe usar una experiencia sticky solo cuando exista espacio suficiente.

Direccion conceptual:

- contenedor general con altura proporcionada al numero de pasos;
- dentro, un panel sticky centrado verticalmente;
- columna izquierda con numero grande, nombre del paso activo e indicador de progreso;
- columna derecha con descripcion del paso activo y microdiagrama simple;
- contenido de cada paso existe en el DOM como items reales;
- el paso activo cambia de forma secuencial mientras el usuario hace scroll;
- el scroll del navegador sigue siendo natural.

Estructura conceptual desktop:

```text
[sticky panel]
  izquierda:
    03
    Proponemos
    progreso vertical 01-07

  derecha:
    Definimos una solución proporcional al problema.
    microdiagrama simple
```

Reglas:

- solo un paso debe tener protagonismo visual a la vez;
- los pasos no activos pueden quedar con menor opacidad, escala visual menor o estilo secundario;
- no debe sentirse como slideshow;
- no bloquear el scroll;
- no interceptar rueda, touch ni teclado;
- no controlar manualmente la velocidad del scroll;
- evitar secciones artificialmente enormes;
- usar una proporcion razonable por paso, por ejemplo entre 60vh y 85vh por item en desktop si visualmente funciona;
- si el viewport tiene poca altura, usar fallback lineal.

## 10. Modelo mobile

Mobile debe usar fallback lineal.

Preferencia aprobada:

```text
01
ENTENDEMOS
Descripción

02
ANALIZAMOS
Descripción
...
```

Requisitos mobile:

- una columna;
- siete pasos visibles como bloques o items de lista;
- sin sticky forzado;
- completamente usable sin JavaScript;
- sin depender de animacion para leer el contenido;
- buen espacio vertical;
- numeros y titulos legibles;
- sin overflow horizontal;
- no ocultar pasos detras de tabs, acordeones o carruseles.

No implementar sticky simplificado en mobile salvo que exista una mejora clara y documentada. La preferencia actual es lectura lineal.

## 11. Indicador de progreso

El indicador desktop debe comunicar posicion dentro del proceso.

Concepto:

```text
● 01
│
○ 02
│
○ 03
│
○ 04
│
○ 05
│
○ 06
│
○ 07
```

El estado activo puede usar:

- acento;
- grosor;
- opacidad;
- tamano moderado;
- texto visible del numero;
- indicador de posicion.

No depender unicamente del color. El paso activo debe diferenciarse tambien por peso, borde, forma, opacidad o texto.

En mobile, el indicador puede simplificarse a los numeros de cada bloque. No hace falta replicar el progreso vertical sticky.

## 12. Diagramas

Cada paso puede incluir un microdiagrama lineal simple si aporta claridad.

Ejemplos conceptuales:

```text
Entendemos: PROBLEMA → OBJETIVO
Analizamos: SISTEMAS → RESTRICCIONES → OPCIONES
Proponemos: OPCIONES → SOLUCIÓN
Validamos: IDEA → PoC → VALIDACIÓN
Definimos: ALCANCE → PLAZOS → COSTOS
Construimos: ITERACIÓN → ENTREGA → REVISIÓN
Acompañamos: SOPORTE → MONITOREO → NUEVAS ETAPAS
```

Reglas:

- los diagramas deben ser ligeros;
- preferir HTML/CSS o SVG inline pequeno;
- no usar imagenes;
- no usar logos;
- no usar canvas ni WebGL;
- pueden omitirse o repetirse patrones si siete diagramas distintos saturan visualmente;
- si son decorativos, usar `aria-hidden="true"`;
- si aportan contenido esencial, deben tener alternativa textual.

La prioridad es simplicidad y claridad del proceso.

## 13. Estrategia JS

La implementacion futura puede usar JavaScript solo para marcar el paso activo en desktop.

Estrategia recomendada:

- todo el contenido se renderiza en HTML desde el inicio;
- cada paso tiene un marcador estable, por ejemplo `[data-process-step]`;
- el contenedor tiene un scope estable, por ejemplo `[data-process-scrolly]`;
- usar `IntersectionObserver` para observar los pasos o sentinels;
- actualizar una clase como `.is-active` y/o un atributo como `aria-current="step"` en el indicador;
- no destruir ni reemplazar texto esencial;
- no usar `aria-live`;
- no usar listeners continuos de `scroll` salvo que exista una razon tecnica documentada;
- no calcular posiciones en cada frame;
- no agregar librerias;
- no interferir con el menu mobile, M04 ni M05.

Si el sticky puede resolverse de forma suficientemente clara solo con CSS y contenido lineal, JS puede limitarse o incluso omitirse. Sin JS, la seccion debe seguir siendo entendible y navegable.

## 14. Reduced motion

Con:

```css
@media (prefers-reduced-motion: reduce)
```

la seccion debe:

- evitar transiciones complejas;
- evitar efectos de protagonismo que dependan de movimiento;
- poder degradarse a lectura lineal;
- no obligar al usuario a atravesar una animacion para acceder al contenido;
- mantener todo el contenido visible o claramente disponible;
- desactivar transformaciones innecesarias.

Si el JS usa `IntersectionObserver`, debe seguir funcionando sin animaciones o puede omitir cambios visuales intensos cuando `prefers-reduced-motion: reduce` este activo.

## 15. Accesibilidad

La informacion completa debe existir en el DOM desde el inicio.

Estrategia preferida:

- seccion semantica con `aria-labelledby`;
- titulo `h2` unico para la seccion;
- lista ordenada `<ol>` con siete `<li>` reales;
- cada paso con numero, titulo y descripcion visibles;
- indicador de progreso duplicado solo si no genera redundancia confusa;
- si existe indicador separado, marcarlo como decorativo o conectarlo con `aria-current="step"` de forma clara;
- no usar `aria-live`;
- no depender solo del color;
- mantener foco visible global;
- no convertir items no interactivos en botones;
- no ocultar contenido esencial con `display: none` para tecnologias asistivas;
- funcionar razonablemente si JavaScript falla.

El sticky desktop debe ser una mejora de presentacion, no la unica forma de acceder al contenido.

## 16. Responsive

Enfoque obligatorio: mobile first.

### Mobile

- fallback lineal;
- una columna;
- sin sticky forzado;
- sin overflow horizontal;
- pasos completos visibles;
- buen ritmo vertical;
- sin necesidad de JavaScript para comprender la seccion.

### Tablet / desktop

- activar sticky solo cuando exista ancho y alto suficiente;
- composicion aproximada de dos columnas;
- columna izquierda para numero, titulo e indicador;
- columna derecha para descripcion y diagrama;
- usar `position: sticky` con offset que respete el navbar;
- si el viewport es bajo, volver a modo lineal.

Breakpoints sugeridos:

- mantener lineal por defecto;
- evaluar sticky desde `64rem` y con altura minima razonable, por ejemplo `min-height: 42rem` o condicion equivalente.

No agregar muchos breakpoints sin necesidad.

## 17. Performance

La implementacion futura debe cumplir:

- JavaScript minimo;
- usar `IntersectionObserver` si se necesita estado activo;
- no usar calculos continuos de scroll;
- no usar librerias externas;
- no agregar dependencias;
- no cargar imagenes pesadas;
- no usar canvas, WebGL ni video;
- reutilizar `assets/js/main.js`;
- mantener CSS acotado en `assets/css/sections.css`;
- evitar layout shifts;
- evitar scroll hijacking;
- mantener la seccion usable sin JS.

## 18. Animaciones

Permitido:

- cambios de opacidad;
- `translateY` leve;
- transicion de indicadores;
- aparicion sutil del contenido activo;
- cambios de borde o superficie.

No usar:

- escalado grande;
- rotaciones;
- efectos 3D;
- movimientos laterales agresivos;
- parallax decorativo;
- snapping obligatorio;
- animaciones que bloqueen lectura;
- movimientos continuos.

Las animaciones deben ser cortas, sobrias y desactivables con reduced motion.

## 19. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion aparezca inmediatamente despues de Servicios;
- la seccion tenga `id="como-trabajamos"`;
- el enlace `Cómo trabajamos` del Navbar funcione hacia esta seccion;
- exista el titulo `Cómo trabajamos`;
- exista una introduccion breve;
- se muestren exactamente siete pasos;
- los pasos respeten el orden aprobado;
- cada paso tenga numero, titulo y descripcion aprobada;
- todo el contenido exista en el DOM;
- desktop use sticky scrollytelling cuando haya espacio suficiente;
- el scroll sea natural;
- no exista scroll hijacking;
- el indicador de progreso refleje el paso activo;
- el estado activo no dependa solo del color;
- mobile use fallback lineal;
- reduced motion este contemplado;
- la seccion funcione razonablemente sin JavaScript;
- no se use `aria-live`;
- no se agreguen librerias externas;
- no se agreguen dependencias;
- no se usen canvas, WebGL, video ni imagenes pesadas;
- no se implemente Demo / PoC ni Spec 008;
- no existan errores de consola evidentes en una prueba local rapida.

## 20. Archivos previstos

La futura implementacion probablemente modificara:

```text
index.html
assets/css/sections.css
assets/js/main.js
specs/007-process-scrollytelling.md
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

## 21. Riesgos / deuda tecnica

- El sticky scrollytelling puede sentirse pesado si cada paso ocupa demasiada altura; mantener una proporcion razonable.
- El indicador de progreso puede generar redundancia para lectores de pantalla si se duplica mal la informacion de la lista.
- `IntersectionObserver` debe mantenerse simple para no introducir fragilidad ni interferir con interacciones existentes.
- En viewports bajos, sticky puede empeorar la experiencia; se requiere fallback lineal.
- Reduced motion debe priorizar lectura directa sobre protagonismo visual.
- Los anchors `#proyectos` y `#faq` del Navbar seguiran pendientes hasta sus specs correspondientes.
- La Spec 006 en disco puede requerir una correccion documental posterior para reflejar su estado implementado, pero no debe mezclarse con la implementacion de M07 salvo instruccion explicita.

## 22. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues de Servicios;
- comprobar que `id="como-trabajamos"` existe;
- comprobar que el link del Navbar funciona;
- verificar que existen exactamente siete pasos;
- verificar que orden y copy coinciden con esta spec;
- revisar fallback mobile lineal;
- revisar desktop sticky de forma basica;
- revisar reduced motion;
- verificar que todo el contenido existe en el DOM;
- verificar que no se usa `aria-live`;
- verificar que no hay scroll hijacking;
- verificar que no se agregaron dependencias ni librerias;
- ejecutar `node --check assets/js/main.js` si se modifica JS;
- revisar consola para errores evidentes;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.