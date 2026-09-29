# Spec 003 - Navbar and Hero

## Estado

Implementada.

Esta spec define el primer bloque comercial real de la landing: Navbar y Hero. Fue implementada tras aprobacion explicita.

## 1. Objetivo

Definir la implementacion futura del Navbar y Hero de `jonathanvaldes.com`, reemplazando la preview temporal de M02 y dejando visible el inicio real de la landing comercial.

La implementacion futura debe mantener el orden aprobado de la landing:

1. Navbar
2. Hero
3. Modulos posteriores, desde Spec 004 en adelante

No debe adelantar el componente dinamico "¿Tu problema es...?" ni ningun modulo posterior.

## 2. Contexto

La Spec 002 dejo una base visual y estructural con:

- `index.html` con preview temporal M02;
- `assets/css/tokens.css`;
- `assets/css/base.css`;
- `assets/css/components.css`;
- `assets/css/styles.css`;
- componentes base como `.container`, `.section`, `.button`, `.button--primary`, `.button--secondary` y `.card`.

La Spec 003 sera el primer reemplazo comercial real de la preview temporal. Debe usar la arquitectura aprobada: HTML, CSS y JavaScript vanilla solo si es estrictamente necesario para el menu mobile.

## 3. Alcance

La implementacion futura de esta spec debe:

- reemplazar la preview temporal de M02 en `index.html`;
- crear un Navbar real visible;
- crear un Hero real visible;
- agregar estilos especificos para Navbar y Hero sin romper la base de M02;
- agregar JS vanilla minimo solo si el menu mobile lo necesita;
- mantener CTA con destinos controlados/placeholders no enganosos;
- incluir un diagrama visual liviano en el Hero;
- mantener responsive mobile first;
- mantener accesibilidad de navegacion, CTA y menu mobile.

## 4. Fuera de alcance

No forma parte de esta spec:

- componente dinamico "¿Tu problema es...?";
- selector de problemas;
- servicios;
- proceso sticky;
- Demo / PoC;
- casos;
- Sobre mi;
- FAQ;
- CTA final;
- footer;
- paginas legales;
- contacto real;
- WhatsApp real;
- reservas reales;
- analytics;
- backend;
- `/cv`;
- links a CV;
- LinkedIn;
- certificaciones;
- experiencia laboral;
- correo o telefono reales;
- imagenes de stock;
- canvas, WebGL, video o librerias de diagramas.

## 5. Copy aprobado

### H1

```text
¿Hay un problema tecnológico que tu empresa necesita resolver?
```

### Subheadline

```text
Lo analizamos, diseñamos una solución y la llevamos a funcionamiento.
```

### Descripcion

```text
Desarrollo, automatización, integraciones, cloud, datos, QA y monitoreo para empresas que necesitan avanzar sin ampliar innecesariamente su equipo tecnológico.
```

### CTA principal

```text
Háblanos hoy
```

### CTA secundario

```text
Agenda hoy mismo
```

### Texto de apoyo

```text
Evaluación inicial sin compromiso · Demo/PoC cuando el caso lo permite.
```

### Mensajes de confianza permitidos

La implementacion puede mostrar hasta cuatro mensajes, priorizando claridad:

- Hablamos directamente.
- Evaluamos antes de construir.
- Alcance y costos claros.
- Soluciones ajustadas al problema.

No es obligatorio mostrar los cuatro si saturan visualmente el Hero.

## 6. Navbar desktop

### Marca

```text
Jonathan Valdés
```

### Navegacion

- Soluciones
- Cómo trabajamos
- Proyectos
- FAQ

### CTA principal

```text
Háblanos hoy
```

### Comportamiento

- sticky;
- visualmente discreto;
- compatible con dark mode;
- fondo oscuro con transparencia controlada;
- blur suave opcional;
- altura contenida;
- CTA visible;
- sin enlace a `/cv`;
- sin LinkedIn, certificaciones, correo, telefono ni links laborales.

### Destinos temporales

Como las secciones aun no existen, la implementacion debe usar destinos controlados no enganosos. Opciones aceptables:

- anchors internos futuros solo si la seccion existe en el mismo modulo;
- `href="#"` evitado si no hay comportamiento;
- `href="#main-content"` o `href="#top"` como placeholder tecnico temporal, con deuda documentada;
- `aria-disabled` no debe usarse en enlaces que parecen accionables.

Recomendacion para esta spec: usar anchors internos controlados y documentar que se actualizaran al implementar las secciones reales.

## 7. Navbar mobile

Debe contemplar:

- marca visible;
- boton real de menu;
- navegacion colapsada;
- CTA `Háblanos hoy`;
- CTA `Agenda hoy mismo`.

### Accesibilidad del menu

El menu mobile debe incluir:

- boton `<button>` real;
- `aria-expanded`;
- `aria-controls`;
- estado abierto/cerrado claro;
- navegacion por teclado;
- focus visible;
- cierre con Escape si se implementa JS;
- cierre al seleccionar una opcion si corresponde;
- manejo razonable del foco, sin atrapar al usuario innecesariamente.

Si requiere JavaScript, debe ser vanilla, pequeno y local al menu.

## 8. Hero layout

### Mobile

- una sola columna;
- copy primero;
- diagrama despues;
- CTA apilados o en wrap legible;
- texto de apoyo cerca de los CTA;
- mensajes de confianza despues del CTA si no saturan;
- sin overflow horizontal;
- buena legibilidad.

### Desktop

- layout aproximado 60/40;
- copy a la izquierda;
- diagrama a la derecha;
- equilibrio entre espacio vacio y contenido;
- Hero debe sentirse como primer viewport comercial, no como preview tecnica;
- no debe ocupar tanto alto que oculte completamente la continuidad de la pagina en todos los viewport.

## 9. Diagrama visual

El Hero debe incluir un diagrama tecnologico minimalista y ligero.

Direccion conceptual:

```text
PROBLEMA
   ↓
  API
   ↓
AUTOMATIZACIÓN
   ↓
RESULTADO
```

Puede resolverse con:

- HTML;
- CSS;
- SVG inline.

Requisitos:

- oscuro, sobrio y alineado a la paleta;
- bordes finos;
- nodos simples;
- flechas o conectores livianos;
- sin stock images;
- sin librerias;
- sin canvas;
- sin WebGL;
- sin video;
- animacion opcional muy sutil y desactivable con `prefers-reduced-motion`.

Si el diagrama es puramente decorativo, debe ocultarse de lectores de pantalla con `aria-hidden="true"`. Si aporta informacion semantica relevante, debe tener texto alternativo o estructura comprensible.

## 10. CTA y placeholders

### CTA principal: `Háblanos hoy`

- No conectar a WhatsApp real todavia.
- No inventar numero.
- Usar destino controlado y no enganoso.
- Documentar deuda para conectar canal real en una spec futura.

### CTA secundario: `Agenda hoy mismo`

- No conectar a sistema real de reservas todavia.
- No inventar agenda.
- Usar destino controlado y no enganoso.
- Documentar deuda para conectar reservas en una spec futura.

Opciones aceptables para placeholders:

- anchors internos temporales si llevan a un bloque existente;
- botones/enlaces con comportamiento temporal claramente controlado;
- destinos `#contacto-pendiente` o similares solo si no generan errores ni mala experiencia.

La implementacion no debe simular integraciones reales.

## 11. Responsive

Enfoque obligatorio: mobile first.

### Mobile

- Navbar compacto;
- menu colapsado;
- CTA accesibles;
- Hero en una columna;
- CTA en stack o wrap;
- diagrama despues del copy;
- sin overflow horizontal;
- tamanos tactiles razonables.

### Desktop

- Navbar horizontal;
- navegacion visible;
- CTA principal visible;
- Hero 60/40;
- diagrama alineado visualmente con copy;
- buen uso de `.container` y tokens M02.

No crear breakpoints excesivos. Preferir los ya existentes o el entorno de `48rem` y `64rem` si se requieren.

## 12. Accesibilidad

La implementacion futura debe incluir:

- navegacion semantica con `<nav>`;
- skip link si se considera necesario para saltar la navegacion;
- H1 unico;
- orden logico del DOM;
- focus visible;
- CTA como enlaces si navegan, botones si ejecutan accion local;
- menu mobile accesible;
- `aria-expanded` y `aria-controls` en menu mobile;
- cierre con Escape si hay JS;
- `prefers-reduced-motion`;
- diagrama decorativo oculto con `aria-hidden="true"` si no aporta informacion esencial;
- no depender solo del color.

## 13. Performance

- JS solo para menu mobile si es necesario;
- SVG inline ligero;
- no cargar imagenes;
- no agregar dependencias;
- no agregar librerias externas;
- no crear layout shifts;
- no incorporar build system;
- mantener CSS acotado al modulo.

## 14. Animaciones

Si existe movimiento:

- debe ser muy sutil;
- preferentemente CSS;
- debe respetar `prefers-reduced-motion`;
- no debe simular el componente rotativo de problemas;
- no debe introducir parallax decorativo, video, canvas ni WebGL.

## 15. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la preview temporal de M02 sea eliminada o reemplazada;
- exista Navbar real visible;
- Navbar sea sticky;
- Navbar desktop tenga marca, navegacion aprobada y CTA `Háblanos hoy`;
- Navbar no enlace CV, LinkedIn, correo, telefono ni informacion laboral;
- menu mobile sea funcional y accesible;
- menu mobile use boton real con `aria-expanded` y `aria-controls`;
- H1 aprobado sea visible y unico;
- subheadline, descripcion y texto de apoyo respeten el copy aprobado;
- CTA principal y secundario sean visibles;
- CTA usen placeholders controlados y no enganosos;
- Hero sea responsive;
- Hero mobile sea una columna con copy primero;
- Hero desktop use layout aproximado 60/40;
- diagrama sea liviano y sin stock images;
- no existan dependencias nuevas;
- no existan errores de consola evidentes;
- no se implemente contenido de Spec 004 o posteriores.

## 16. Archivos previstos a modificar

Archivos previstos:

```text
index.html
assets/css/components.css
assets/css/styles.css
```

Archivo opcional si el menu mobile requiere JS:

```text
assets/js/main.js
```

Archivo opcional si se decide separar estilos del modulo:

```text
assets/css/sections.css
```

Restricciones:

- no modificar documentos de fase;
- no modificar `AGENTS.md`;
- no crear `/cv`;
- no crear paginas legales;
- no copiar archivos legacy;
- no agregar dependencias.

## 17. Riesgos / deuda tecnica

- Los CTA no tendran integracion real aun; deben quedar como placeholders controlados y documentados.
- La navegacion apunta a secciones que se implementaran en modulos posteriores; los destinos deben evitar experiencias enganosas.
- El menu mobile puede requerir JS minimo; debe mantenerse pequeno y sin dependencias.
- Si el diagrama se vuelve demasiado complejo, puede afectar claridad/performance; mantenerlo como SVG/HTML simple.
- La implementacion futura debera retirar la preview temporal M02 sin adelantar Spec 004.

## 18. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que `index.html` carga los estilos;
- verificar visualmente mobile y desktop de forma basica;
- verificar apertura/cierre del menu mobile si existe JS;
- verificar teclado y focus visible en menu y CTA;
- revisar consola para errores evidentes;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas.


