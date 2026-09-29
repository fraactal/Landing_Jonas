# Spec 004 - Dynamic Problem Section

## Estado

Implementada.

Esta spec define la seccion dinamica `¿Tu problema es...?`. Fue implementada tras aprobacion explicita.

## 1. Objetivo

Definir la seccion dinamica `¿Tu problema es...?` de `jonathanvaldes.com` para que el visitante se identifique rapidamente con un problema concreto sin agregar demasiado texto ni adelantar el selector interactivo de problemas.

La seccion debe sentirse:

- elegante;
- minimalista;
- tecnologica;
- clara;
- ligera;
- no publicitaria;
- coherente con el Hero implementado en Spec 003.

La implementacion futura debe mantener la arquitectura aprobada para V1: HTML, CSS y JavaScript vanilla minimo solo cuando sea necesario.

## 2. Contexto

La Spec 002 dejo la base visual y tecnica de la landing: tokens, estilos base, componentes reutilizables, `styles.css` como entrada CSS y fundamentos responsive/accesibles.

La Spec 003 implemento Navbar y Hero, dejando el inicio real de la landing comercial. La Spec 004 debe continuar inmediatamente despues del Hero con la primera interaccion visual principal aprobada: el texto dinamico `¿Tu problema es...?`.

Fase 3 y Fase 4 aprobaron esta seccion como una pieza de reconocimiento rapido del dolor del cliente. Debe hablar primero del problema, no de la tecnologia, y no debe convertirse en un carrusel, selector, formulario, CTA ni modulo comercial posterior.

## 3. Ubicacion

La seccion debe ubicarse inmediatamente despues del Hero y antes del selector interactivo de problemas.

Orden esperado:

```text
Hero
↓
¿Tu problema es...?
↓
Selector de problemas
```

En la implementacion futura, la seccion deberia quedar dentro de `<main>` despues de la seccion `.hero` existente.

## 4. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real para `¿Tu problema es...?` despues del Hero;
- incluir el texto fijo aprobado;
- incluir una segunda linea con textos rotativos aprobados;
- definir si el cierre estatico se muestra o se omite por limpieza visual;
- implementar rotacion automatica simple de la segunda linea;
- usar transiciones suaves con `opacity` y `translateY` leve;
- respetar `prefers-reduced-motion`;
- evitar anuncios repetitivos para lectores de pantalla;
- mantener mobile first;
- evitar overflow horizontal;
- evitar layout shifts evidentes entre textos de distinta longitud;
- reutilizar el sistema visual existente y los tokens ya definidos;
- usar JavaScript vanilla minimo en `assets/js/main.js` si se requiere para la rotacion;
- no agregar dependencias, imagenes, fuentes ni archivos nuevos innecesarios.

## 5. Fuera de alcance

No forma parte de esta spec:

- selector interactivo de problemas;
- cards;
- CTA contextual;
- WhatsApp;
- agenda;
- servicios;
- proceso sticky;
- Demo / PoC;
- casos;
- About;
- FAQ;
- CTA final;
- Footer;
- paginas legales;
- analytics;
- backend;
- `/cv`;
- formularios;
- datos reales de contacto;
- librerias de animacion;
- carruseles;
- typewriter effect;
- efectos de caracteres apareciendo uno a uno;
- parpadeos;
- movimientos bruscos;
- WebGL, canvas, video o imagenes.

## 6. Copy aprobado

### Texto fijo

```text
¿Tu problema es...
```

### Textos rotativos

Usar exactamente estos textos y en este orden inicial salvo que exista una razon documentada para cambiarlo:

1. `un proceso manual?`
2. `sistemas desconectados?`
3. `falta de visibilidad?`
4. `una aplicación pendiente?`
5. `infraestructura inestable?`
6. `datos que no estás aprovechando?`
7. `demasiados errores o pruebas manuales?`

### Cierre opcional

```text
Podemos ayudarte a convertirlo en una solución concreta.
```

La implementacion futura debe evaluar visualmente si el cierre se muestra de forma permanente debajo del texto dinamico o si se omite para mantener la seccion mas limpia. Si se omite, debe quedar documentado en el resumen de implementacion de esa spec.

No agregar CTA en esta seccion.

## 7. Comportamiento de rotacion

La segunda linea debe cambiar automaticamente entre los textos aprobados.

Intervalo orientativo:

```text
2.5-3 segundos
```

Reglas:

- iniciar con `un proceso manual?`;
- avanzar de forma circular por la lista;
- mantener una cadencia tranquila;
- no ejecutar trabajo innecesario fuera del cambio de texto;
- no pausar o bloquear la navegacion del usuario;
- no depender de hover, foco o scroll para que el contenido sea comprensible;
- evitar que la rotacion modifique el alto de la seccion de forma perceptible.

La rotacion debe ser una mejora progresiva: si JavaScript no carga, la seccion debe seguir mostrando un mensaje comprensible.

## 8. Animacion

Transicion recomendada:

- salida con `opacity` hacia 0;
- `translateY` muy leve;
- cambio de texto;
- entrada con `opacity` hacia 1;
- retorno a posicion base.

Duracion sugerida:

```text
180-280 ms
```

Restricciones:

- no usar typewriter effect;
- no animar caracteres uno a uno;
- no usar parpadeos;
- no usar movimientos bruscos;
- no usar carrusel horizontal;
- no usar librerias de animacion;
- no crear una nueva interaccion visual distinta a la aprobada.

La animacion debe aportar claridad y ritmo, no llamar la atencion por si misma.

## 9. Reduced motion

La implementacion futura debe contemplar explicitamente:

```css
@media (prefers-reduced-motion: reduce)
```

Comportamiento requerido:

- no debe existir animacion continua;
- la prioridad es estabilidad visual;
- opcion preferida: mostrar una unica frase estatica y no iniciar el intervalo de rotacion cuando `prefers-reduced-motion: reduce` esta activo;
- opcion alternativa: mantener el primer texto y desactivar transiciones CSS;
- solo permitir cambios sin transicion si existe una razon clara y documentada.

El JavaScript debe consultar `window.matchMedia("(prefers-reduced-motion: reduce)")` antes de iniciar la rotacion o debe recibir una clase/estado que impida el intervalo cuando el usuario prefiere menos movimiento.

## 10. Accesibilidad

El texto cambiante no debe convertirse en ruido para lectores de pantalla.

Estrategia recomendada:

- estructurar la seccion con HTML semantico y un heading propio, por ejemplo un `h2`;
- mantener el texto fijo y una alternativa semantica estable para tecnologias asistivas;
- evitar `aria-live` agresivo;
- no anunciar cada cambio automaticamente cada 2.5-3 segundos;
- si el texto visual rotativo queda separado, marcarlo con `aria-hidden="true"` y proveer una frase accesible estable;
- no depender solo del color para comunicar importancia;
- mantener foco visible global sin introducir controles nuevos;
- no agregar botones, inputs ni links en esta seccion.

Ejemplo conceptual de contenido accesible estable:

```text
¿Tu problema es un proceso manual, sistemas desconectados, falta de visibilidad, una aplicación pendiente, infraestructura inestable, datos que no estás aprovechando o demasiados errores o pruebas manuales?
```

La implementacion futura puede ajustar esta frase para mejorar legibilidad, siempre que no cambie el sentido de los problemas aprobados.

## 11. Responsive

Enfoque obligatorio: mobile first.

### Mobile

- una sola columna;
- texto centrado o alineado de forma coherente con la continuidad del Hero;
- tamano legible;
- spacing generoso, sin saturar el primer scroll;
- evitar saltos visuales grandes al cambiar la longitud del texto;
- sin overflow horizontal;
- si el cierre se muestra, debe quedar cerca del texto dinamico sin parecer CTA.

### Desktop

- mayor escala tipografica;
- mucho espacio negativo;
- composicion simple y de alto impacto;
- ancho controlado para mantener buena lectura;
- alineacion coherente con el sistema de `.container`;
- sin cards ni decoracion pesada.

No crear breakpoints excesivos. Preferir los patrones existentes alrededor de `48rem` y `64rem` si se requieren.

## 12. Performance

La implementacion futura debe cumplir:

- JavaScript muy pequeno;
- reutilizar `assets/js/main.js` si es razonable;
- no crear un nuevo bundle;
- no agregar dependencias;
- no instalar librerias;
- no agregar imagenes;
- no agregar fuentes;
- no usar canvas, WebGL ni video;
- no ejecutar timers cuando no corresponda;
- pausar o evitar la rotacion cuando la pagina no esta visible si se implementa de forma simple;
- mantener cambios acotados a HTML, CSS y JS existentes.

## 13. Estrategia JS

La estrategia futura recomendada es ampliar `assets/js/main.js` con un bloque pequeno e independiente para la seccion dinamica.

El JS debe:

- definir la lista exacta de problemas aprobados;
- buscar un nodo con un atributo estable, por ejemplo `[data-dynamic-problem]`;
- iniciar solo si el nodo existe;
- usar `setInterval` con intervalo entre 2.5 y 3 segundos;
- aplicar una clase transitoria para animar salida/entrada mediante CSS;
- actualizar solo `textContent`;
- respetar `prefers-reduced-motion` evitando iniciar la rotacion;
- evaluar `document.hidden` para pausar la rotacion cuando la pestana no esta visible;
- reanudar de forma simple al volver a ser visible si no hay reduced motion;
- no crear estado global innecesario;
- no interferir con el JS existente del menu mobile;
- no usar librerias.

La pausa por visibilidad debe ser simple. Si vuelve compleja la implementacion, puede omitirse y documentarse como deuda tecnica no bloqueante.

## 14. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion aparezca inmediatamente despues del Hero;
- exista el texto fijo `¿Tu problema es...`;
- se utilicen unicamente los problemas aprobados;
- la segunda linea rote automaticamente;
- el intervalo sea razonable, entre 2.5 y 3 segundos aproximadamente;
- la transicion use `opacity` y `translateY` leve;
- no exista typewriter effect, carrusel, parpadeo ni movimiento brusco;
- no existan layout shifts evidentes entre textos;
- `prefers-reduced-motion` este contemplado y reduzca o elimine el movimiento continuo;
- lectores de pantalla no reciban anuncios repetitivos;
- exista una alternativa semantica estable para el contenido dinamico;
- la seccion sea responsive en mobile y desktop;
- no haya overflow horizontal;
- no se agreguen CTA;
- no se agreguen cards;
- no se implemente el selector de problemas;
- no se implemente contenido de Spec 005 o posterior;
- no se agreguen dependencias;
- no se agreguen imagenes, fuentes, canvas, WebGL ni video;
- no existan errores de consola evidentes en una prueba local rapida;
- el JS de menu mobile existente siga funcionando.

## 15. Archivos previstos

La futura implementacion deberia modificar unicamente lo necesario, probablemente:

```text
index.html
assets/css/sections.css
assets/js/main.js
specs/004-dynamic-problem-section.md
```

No crear nuevos archivos si no aportan valor claro.

No modificar en esta spec:

- `AGENTS.md`;
- documentos de fase aprobados;
- `assets/css/tokens.css`, salvo necesidad excepcional y documentada;
- `assets/css/base.css`, salvo necesidad excepcional y documentada;
- `assets/css/components.css`, salvo necesidad excepcional y documentada;
- `/cv`;
- paginas legales;
- infraestructura;
- Terraform;
- configuraciones secretas;
- archivos legacy externos.

## 16. Riesgos / deuda tecnica

- Textos rotativos con longitudes distintas pueden producir cambios de alto o ancho si no se reserva espacio suficiente.
- La rotacion puede resultar distractora si el intervalo es demasiado corto o la animacion demasiado evidente.
- El uso incorrecto de `aria-live` podria generar anuncios repetitivos para lectores de pantalla.
- Pausar por `document.hidden` es deseable, pero debe mantenerse simple para no sobredisenar el modulo.
- Si el cierre estatico se muestra junto al texto dinamico, podria saturar una seccion que debe sentirse limpia.
- Los anchors del Navbar hacia secciones futuras siguen siendo deuda de specs posteriores y no deben resolverse en este modulo.

## 17. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues del Hero;
- comprobar que no se agrego el selector de problemas;
- revisar que `index.html` sigue cargando `assets/css/styles.css` y `assets/js/main.js`;
- verificar visualmente mobile y desktop de forma basica;
- verificar que no hay overflow horizontal evidente;
- verificar que no hay layout shift evidente entre textos;
- verificar comportamiento con `prefers-reduced-motion`;
- verificar que lectores de pantalla no reciben cambios repetitivos mediante `aria-live` innecesario;
- revisar consola para errores evidentes;
- verificar que el menu mobile de Spec 003 sigue funcionando;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.
