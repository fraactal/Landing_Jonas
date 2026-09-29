# Spec 002 - Base Layout and Design System

## Estado

Implementada.

Esta spec define la base tecnica y visual reusable para construir la landing comercial en modulos posteriores. Fue implementada como base estructural y visual, sin avanzar a modulos comerciales posteriores.

## 1. Objetivo

Definir la estructura base del frontend y el sistema visual minimo de `jonathanvaldes.com` para que las specs posteriores puedan construir la landing comercial de forma consistente, estatica, accesible, performante y mantenible.

La implementacion futura de esta spec debe dejar preparados:

- HTML semantico minimo;
- estructura base de archivos frontend;
- estilos globales;
- design tokens mediante CSS custom properties;
- carga tipografica simple;
- paleta aprobada;
- espaciado, containers y breakpoints;
- botones base;
- card base;
- estados de focus;
- fundamentos responsive mobile first;
- fundamentos de accesibilidad;
- soporte para `prefers-reduced-motion`.

## 2. Contexto

La Spec 001 dejo el repositorio aislado, las fuentes de verdad organizadas y la decision de mantener el sitio profesional anterior fuera de este repo hasta una migracion futura controlada a `/cv`.

Fase 2 es la fuente de verdad arquitectonica actual. La V1 debe ser preferentemente estatica y simple:

- HTML;
- CSS;
- JavaScript vanilla solo cuando sea estrictamente necesario.

La Fase 4 define una identidad visual minimalista tecnologica premium, dark mode, con Manrope para titulos y numeros destacados, Inter para cuerpo y controles, bordes finos, sombras minimas, radios moderados y un unico color de acento dominante.

## 3. Alcance

La implementacion futura de esta spec podra crear o modificar exclusivamente la base estructural y visual necesaria para los modulos posteriores:

- `index.html` con esqueleto semantico minimo y metadata tecnica basica;
- carpetas frontend base;
- hojas CSS globales;
- tokens visuales;
- reglas base de tipografia y layout;
- clases base de container y section;
- clases base de botones;
- clase base de card;
- utilidades minimas y justificadas;
- reglas globales de focus;
- reglas de reduced motion;
- base responsive mobile first.

La pagina resultante puede contener placeholders estructurales minimos solo para verificar que los estilos base cargan, pero no debe construir secciones comerciales completas.

## 4. Fuera de alcance

No forma parte de esta spec:

- construir la landing completa;
- implementar Navbar;
- implementar Hero;
- implementar el componente dinamico "¿Tu problema es...?";
- implementar selector de problemas;
- implementar servicios finales;
- implementar sticky scrollytelling;
- implementar Demo / PoC;
- implementar casos;
- implementar Sobre mi;
- implementar FAQ;
- implementar CTA final o footer definitivo;
- crear `/cv`;
- crear `/privacidad` o `/terminos` con contenido final;
- copiar el sitio anterior;
- integrar contacto, WhatsApp real, email real, agenda o analytics;
- agregar React, Vue, Angular, Next.js, Astro, Svelte, Tailwind, Bootstrap, frameworks CSS, librerias de componentes o librerias de animacion;
- incorporar build system;
- cargar imagenes finales;
- ejecutar deploy, Terraform, Lighthouse o auditorias extensas.

## 5. Estructura prevista

La implementacion futura debe usar una estructura simple:

```text
jonathanValdes.com/
├── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── styles.css
│   ├── js/
│   ├── images/
│   └── icons/
├── privacidad/
├── terminos/
├── docs/
└── specs/
```

Notas:

- `index.html` sera la entrada de la landing comercial.
- `assets/css/tokens.css` centralizara CSS custom properties.
- `assets/css/base.css` tendra reset ligero, tipografia global, accesibilidad base y layout raiz.
- `assets/css/components.css` tendra componentes atomicos reutilizables: botones, cards, container, section y focus.
- `assets/css/styles.css` actuara como punto de entrada CSS e importara los archivos anteriores.
- `assets/js/` queda reservado para JS vanilla futuro. En esta spec no deberia requerirse JS salvo que aparezca una necesidad tecnica concreta.
- `assets/images/` e `assets/icons/` quedan preparados, pero no deben cargarse imagenes finales todavia.
- `privacidad/` y `terminos/` pueden quedar como rutas previstas para specs futuras; no deben crearse con contenido final en esta spec salvo que una spec posterior lo apruebe.

Si durante la implementacion se propone una variante, debe ser mas simple que esta estructura y justificar por que reduce complejidad.

## 6. Design tokens

La implementacion futura debe usar CSS custom properties en `assets/css/tokens.css`.

Tokens minimos requeridos:

### Colores

```css
:root {
  --color-bg: #0B0D10;
  --color-surface: #12161C;
  --color-text: #F4F6F8;
  --color-muted: #9AA4B2;
  --color-accent: #4F7CFF;
  --color-accent-soft: #8BA7FF;
  --color-border: #242A33;
}
```

### Tipografia

- familia de titulos;
- familia de cuerpo;
- pesos usados;
- tamanos tipograficos base;
- line heights.

### Espaciado

Usar una escala corta y legible. No crear decenas de tokens arbitrarios.

Ejemplo conceptual:

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
```

### Layout

- ancho maximo de container;
- gutters mobile;
- gutters desktop;
- spacing vertical de seccion.

### Radius, border, transitions y z-index

Definir solo lo necesario:

- radius pequeno / medio;
- border base;
- transiciones cortas;
- z-index minimo para capas futuras como navbar sticky, si corresponde.

## 7. Tipografia

Tipografias aprobadas:

- Manrope para headings, numeros destacados y elementos de alta jerarquia;
- Inter para cuerpo, botones, formularios y controles.

Carga propuesta:

- Usar Google Fonts mediante `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- Cargar solo pesos necesarios para V1, inicialmente `Inter` 400/500/600 y `Manrope` 600/700.
- Usar `display=swap` para evitar texto invisible.
- Definir fallbacks de sistema.

Ejemplo conceptual de familias:

```css
--font-heading: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

No cambiar tipografias sin documentar una razon tecnica, por ejemplo privacidad, disponibilidad, rendimiento o decision de self-hosting.

## 8. Paleta

Paleta aprobada:

- `#0B0D10` fondo principal;
- `#12161C` superficie;
- `#F4F6F8` texto principal;
- `#9AA4B2` texto secundario;
- `#4F7CFF` acento principal;
- `#8BA7FF` acento suave;
- `#242A33` bordes.

Reglas:

- dark mode como base;
- evitar paletas alternativas en esta etapa;
- un unico acento dominante;
- no usar gradientes decorativos pesados;
- mantener contraste suficiente en texto, botones y focus.

## 9. Componentes base

La implementacion futura debe definir solo componentes fundamentales y reutilizables.

### Container

Clase propuesta: `.container`

Responsabilidades:

- ancho maximo consistente;
- gutters responsive;
- centrado horizontal;
- no imponer estilos visuales de card.

### Section

Clase propuesta: `.section`

Responsabilidades:

- spacing vertical consistente;
- permitir variantes futuras sin acoplar contenido comercial.

### Boton primario

Clase propuesta: `.button.button--primary`

Uso:

- CTA principal como `Háblanos hoy`.

Requisitos visuales:

- fondo `#4F7CFF`;
- texto de alto contraste;
- radio moderado;
- sin sombras fuertes;
- hover/focus perceptible;
- area tactil razonable.

### Boton secundario

Clase propuesta: `.button.button--secondary`

Uso:

- CTA secundarios como `Agenda hoy mismo`.

Requisitos visuales:

- fondo transparente o superficie sutil;
- borde tenue;
- hover con superficie ligera;
- focus visible.

### Card base

Clase propuesta: `.card`

Uso futuro:

- problemas;
- servicios;
- casos;
- bloques informativos.

Requisitos visuales:

- fondo `#12161C`;
- borde `#242A33`;
- radio moderado;
- sombra minima o ninguna;
- padding consistente;
- hover sutil solo si el elemento es interactivo.

### Focus state

Definir estado global para elementos interactivos:

- visible;
- consistente;
- de alto contraste;
- no depender solo del cambio de color de fondo.

Ejemplo conceptual:

```css
:focus-visible {
  outline: 2px solid var(--color-accent-soft);
  outline-offset: 3px;
}
```

## 10. Responsive

Enfoque obligatorio: mobile first.

La implementacion futura debe definir:

- gutter mobile inicial entre `1rem` y `1.25rem`;
- container desktop con max-width aproximado entre `1120px` y `1200px`;
- escala tipografica responsive con `clamp()` donde aporte claridad;
- grids futuros que partan de una columna en mobile;
- uno o dos breakpoints maximos en esta base.

Breakpoints sugeridos:

```css
--bp-md: 48rem;
--bp-lg: 64rem;
```

No agregar muchos breakpoints sin necesidad real.

## 11. Accesibilidad

La implementacion futura debe incluir:

- `box-sizing: border-box` global;
- HTML semantico minimo;
- skip link si existe navegacion en specs posteriores;
- focus visible;
- contraste suficiente;
- tamanos tactiles razonables para botones y enlaces prominentes;
- `prefers-reduced-motion`;
- no depender solo del color;
- labels reales en formularios futuros;
- ARIA solo cuando corresponda.

Para esta spec, no se deben crear formularios ni accordions finales.

## 12. Performance

La implementacion futura debe priorizar:

- cero dependencias JS innecesarias;
- CSS simple y modular;
- fuentes externas minimizadas;
- `display=swap`;
- evitar layout shift;
- no cargar imagenes finales todavia;
- no incorporar build system salvo necesidad tecnica real y documentada;
- no usar librerias de animacion;
- no usar WebGL, video background ni parallax decorativo.

## 13. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- exista `index.html` con base HTML valida;
- exista `assets/css/tokens.css` con tokens centralizados;
- exista `assets/css/base.css` con estilos globales;
- exista `assets/css/components.css` con componentes base;
- exista `assets/css/styles.css` como entrada de estilos;
- las tipografias aprobadas esten cargadas de forma simple y performante;
- la paleta aprobada este representada en tokens;
- los estilos globales funcionen;
- exista `.container` responsive;
- exista `.section` para spacing vertical;
- existan boton primario y boton secundario;
- exista card base;
- exista focus visible;
- `prefers-reduced-motion` este contemplado;
- no existan dependencias JS innecesarias;
- no se haya construido contenido de modulos futuros;
- no se haya creado `/cv`;
- no se hayan copiado archivos legacy;
- no existan errores de consola evidentes en una prueba local rapida.

## 14. Archivos previstos a crear/modificar

Archivos previstos para la futura implementacion:

```text
index.html
assets/css/tokens.css
assets/css/base.css
assets/css/components.css
assets/css/styles.css
```

Carpetas previstas:

```text
assets/
assets/css/
assets/js/
assets/images/
assets/icons/
```

Opcionalmente, solo si la implementacion lo requiere para preparar rutas futuras sin contenido final:

```text
privacidad/
terminos/
```

No modificar en esta spec:

- documentos de fase aprobados;
- `AGENTS.md`;
- archivos legacy externos;
- infraestructura;
- Terraform;
- configuraciones secretas.

## 15. Riesgos / deuda tecnica

- Cargar fuentes desde Google Fonts puede tener implicancias de privacidad y dependencia externa; si se decide self-hosting, debe documentarse antes de cambiar la decision.
- Dividir CSS en demasiados archivos podria ser excesivo para una V1; la estructura propuesta se acepta porque separa tokens/base/componentes sin introducir build system.
- Los componentes base deben mantenerse genericos para no adelantar Navbar, Hero, FAQ o secciones comerciales.
- Un exceso de tokens prematuros puede dificultar mantenimiento; mantener la escala simple.
- Las rutas legales estan previstas, pero su contenido final queda para una spec posterior.

## 16. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- abrir o servir localmente el HTML si es necesario para confirmar carga basica;
- revisar consola del navegador si se ejecuta una prueba local;
- validar visualmente que botones, card, container y focus existen;
- revisar que no se agregaron dependencias ni archivos fuera de alcance;
- `git diff --stat` al finalizar.

No ejecutar en esta spec:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas.


