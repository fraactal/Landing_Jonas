# Spec 006 - Services

## Estado

Implementada.

Esta spec define la futura seccion comercial de servicios de `jonathanvaldes.com`. En este modulo solo se prepara la especificacion; no se implementa HTML, CSS ni JavaScript.

## 1. Objetivo

Definir una seccion de servicios clara, breve y orientada a solucion, que explique que tipos de problemas tecnologicos podemos abordar sin convertir la landing en un catalogo tecnico.

La prioridad de comunicacion es:

```text
problema y resultado primero; tecnologia despues.
```

La seccion debe ayudar al visitante a reconocer capacidades disponibles para construir una solucion concreta, sin exigirle saber que tecnologia necesita.

## 2. Contexto

La Spec 002 dejo la base visual y tecnica.

La Spec 003 implemento Navbar y Hero.

La Spec 004 implemento la seccion dinamica `¿Tu problema es...?`.

La Spec 005 implemento el selector interactivo `¿Qué necesitas resolver?`.

La Spec 006 debe continuar el flujo comercial despues del selector: el visitante ya identifico un problema y ahora puede ver, de forma escaneable, las principales lineas de solucion disponibles.

Fase 1 y Fase 3 aprobaron siete lineas de servicio. Fase 4 definio que esta seccion debe tener un tratamiento editorial, con cards compactas, numeros, titulos, descripcion breve, iconografia lineal opcional y hover discreto.

## 3. Ubicacion

La seccion debe aparecer inmediatamente despues del selector interactivo de problemas y antes de `Cómo trabajamos`.

Orden esperado:

```text
Selector de problemas
↓
Servicios
↓
Cómo trabajamos
```

En la implementacion futura, la seccion debe quedar dentro de `<main>` despues de `.problem-selector`.

## 4. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real de servicios;
- asignar a la seccion el anchor estable `id="soluciones"`;
- usar el titulo aprobado o una variante equivalente mas breve si se justifica;
- incluir una introduccion de maximo 1-2 frases;
- mostrar exactamente siete servicios aprobados;
- respetar el orden aprobado;
- usar copy breve y orientado a solucion;
- reutilizar el sistema visual existente;
- usar cards o bloques editoriales claros;
- incluir numero, titulo y descripcion por servicio;
- usar icono lineal o detalle grafico simple solo si aporta claridad;
- mantener mobile first;
- mantener accesibilidad y buen contraste;
- evitar nuevas dependencias;
- evitar JavaScript nuevo.

## 5. Fuera de alcance

No forma parte de esta spec:

- sticky process;
- seccion `Cómo trabajamos`;
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
- paginas legales;
- `/cv`;
- listas extensas de tecnologias;
- logos de herramientas;
- screenshots;
- CTA individual por servicio;
- botones `Ver más`;
- acordeones;
- modales;
- carruseles;
- Spec 007 o cualquier seccion posterior.

## 6. Titulo e introduccion

### Titulo propuesto

```text
Soluciones que podemos construir contigo
```

No usar titulos genericos como `Nuestros servicios` si existe una opcion mas orientada al cliente.

### Introduccion propuesta

```text
Combinamos desarrollo, automatización, integraciones, cloud, datos, QA y monitoreo según el problema que necesitas resolver. No necesitas saber qué tecnología usar: primero entendemos la necesidad y después definimos una solución proporcional.
```

La introduccion debe mantenerse breve. No debe transformarse en una explicacion tecnica extensa.

## 7. Siete servicios y copy

Usar exactamente estos siete servicios, en este orden.

### 01 - Desarrollo de Software

```text
Aplicaciones, APIs, sistemas internos y MVP para resolver procesos concretos.
```

### 02 - Automatizacion e IA

```text
Automatización de tareas, workflows y soluciones con IA cuando existe un caso de uso real.
```

### 03 - Integraciones

```text
Conexión entre aplicaciones, APIs, bases de datos y servicios que hoy trabajan separados.
```

### 04 - Cloud & DevOps

```text
Infraestructura, AWS, Docker, CI/CD y automatización de despliegues.
```

### 05 - QA & Calidad

```text
Testing, automatización y controles para reducir errores antes de producción.
```

### 06 - Data & Business Intelligence

```text
ETL, integración de datos, SQL, reporting, dashboards y explotación de información.
```

### 07 - Monitoreo & Visibilidad

```text
Métricas, logs, alertas, observabilidad, dashboards y KPIs para entender qué está ocurriendo.
```

No agregar nuevas lineas de servicio en M06. Cualquier ajuste futuro de copy debe preservar el significado aprobado.

## 8. Diseño

La seccion debe sentirse editorial, liviana y premium, coherente con el dark mode ya implementado.

Cada servicio debe incluir:

- numero;
- titulo;
- descripcion breve;
- icono lineal opcional o detalle grafico simple.

Reglas visuales:

- priorizar lectura rapida;
- usar mucho espacio negativo;
- evitar sensacion de catalogo saturado;
- mantener numeros con baja jerarquia visual;
- destacar titulos y descripciones sin exceso decorativo;
- no usar screenshots ni logos de herramientas;
- no sumar efectos visuales que compitan con las interacciones principales aprobadas.

## 9. Layout

### Mobile

- una columna;
- cards o bloques claramente separados;
- buen espacio vertical;
- titulos legibles;
- descripciones breves;
- sin overflow horizontal;
- sin truncar titulos.

### Tablet / desktop

La implementacion futura puede evaluar:

- 2 columnas;
- 3 columnas;
- layout editorial irregular controlado.

Preferencia aprobada: 2 columnas.

Motivo: siete elementos en 3 o 4 columnas pueden quedar pequenos y parecer catalogo tecnico. Dos columnas permiten mejor lectura, mas aire y una composicion mas editorial.

Si se usa una composicion irregular, debe mantenerse controlada, legible y coherente con el sistema visual existente.

## 10. Uso de cards

Reutilizar el design system existente siempre que sea suficiente.

Opcion recomendada:

- usar `.card` como base visual;
- agregar una clase especifica minima para servicios solo si hace falta controlar layout interno, numero o hover;
- no crear un componente nuevo si `.card` resuelve la necesidad.

Cada card o bloque debe contener:

- numero de servicio con baja jerarquia;
- titulo del servicio;
- descripcion breve.

No incluir CTA dentro de las cards.

## 11. Microinteracciones

Permitido:

- cambio sutil de borde/acento al hover;
- cambio sutil de superficie;
- desplazamiento muy leve;
- transiciones cortas.

No usar:

- flip;
- zoom fuerte;
- animaciones complejas;
- movimiento continuo;
- efectos 3D;
- carruseles;
- animaciones que dificulten lectura.

Con `prefers-reduced-motion: reduce`, evitar transformaciones innecesarias y mantener cambios visuales sin movimiento relevante.

## 12. Accesibilidad

La implementacion futura debe incluir:

- seccion semantica con heading propio;
- heading de seccion asociado mediante `aria-labelledby` si corresponde;
- titulos coherentes para cada servicio;
- estructura DOM logica;
- contraste suficiente;
- foco visible en elementos interactivos si existieran;
- no depender solo del color para comunicar hover o jerarquia;
- iconos decorativos con `aria-hidden="true"` cuando corresponda;
- textos visibles y completos, sin truncamientos;
- no usar cards clickeables si no navegan ni ejecutan una accion.

Como esta seccion no requiere CTA ni controles, no deberia agregar interacciones que necesiten ARIA compleja.

## 13. Responsive

Enfoque obligatorio: mobile first.

La implementacion futura debe evitar:

- cards excesivamente estrechas;
- columnas que obliguen a cortar titulos;
- saltos de linea incomodos;
- descripciones truncadas;
- overflow horizontal;
- cambios de layout que generen saltos visuales evidentes.

Breakpoints recomendados: reutilizar los existentes alrededor de `48rem` y `64rem` si se requieren. No agregar breakpoints nuevos salvo necesidad concreta.

## 14. Performance

La seccion debe ser liviana.

Requisitos:

- sin JavaScript nuevo;
- sin dependencias;
- sin imagenes;
- sin logos externos;
- sin fetch ni llamadas de red;
- sin canvas, WebGL ni video;
- iconos opcionales mediante SVG inline ligero;
- CSS acotado en `assets/css/sections.css`;
- reutilizar tokens y componentes existentes.

Idealmente M06 debe resolverse solo con HTML + CSS.

## 15. Anchor / navegacion

La seccion debe definir el anchor estable:

```html
id="soluciones"
```

El enlace `Soluciones` del Navbar debe apuntar a esta seccion.

No implementar otros anchors nuevos fuera de alcance en M06. Los anchors futuros de `Cómo trabajamos`, `Proyectos` y `FAQ` se resolveran cuando existan sus secciones.

## 16. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion sea visible inmediatamente despues de M05;
- la seccion tenga `id="soluciones"`;
- el enlace `Soluciones` del Navbar funcione hacia esta seccion;
- exista el titulo `Soluciones que podemos construir contigo` o una variante equivalente documentada;
- exista una introduccion breve de maximo 1-2 frases;
- se muestren exactamente siete servicios;
- los servicios respeten el orden aprobado;
- cada servicio tenga numero, titulo y descripcion breve;
- el copy sea orientado a solucion y no a catalogo tecnico;
- no existan listas largas de tecnologias;
- no existan logos de herramientas ni screenshots;
- no exista CTA individual por servicio;
- no se implementen acordeones, modales ni carruseles;
- la seccion sea responsive en mobile y desktop;
- no exista overflow horizontal;
- la estructura sea semantica y accesible;
- los iconos decorativos, si existen, esten ocultos para lectores de pantalla;
- no se agregue JavaScript nuevo;
- no se agreguen dependencias;
- no se implemente Spec 007 ni secciones posteriores;
- no existan errores evidentes en una revision rapida.

## 17. Archivos previstos

La futura implementacion probablemente modificara:

```text
index.html
assets/css/sections.css
specs/006-services.md
```

Archivo opcional solo si aparece un patron reusable claro:

```text
assets/css/components.css
```

No deberia ser necesario modificar:

```text
assets/js/main.js
```

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

## 18. Riesgos / deuda tecnica

- Siete servicios pueden sentirse como catalogo si el layout usa demasiadas columnas o poco espacio vertical.
- Algunos servicios contienen tecnologias especificas necesarias como evidencia, pero el copy no debe crecer hacia listas tecnicas extensas.
- Si se agregan iconos, deben ser simples y consistentes; iconografia excesiva puede saturar la seccion.
- El anchor `#soluciones` resuelve el enlace del Navbar, pero otros anchors del Navbar seguiran pendientes hasta sus specs correspondientes.
- La ausencia de CTA en esta seccion es deliberada; la conversion vive en Hero, selector y secciones posteriores.

## 19. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues del selector de problemas;
- comprobar que `id="soluciones"` existe y funciona con el Navbar;
- verificar que existen exactamente siete servicios;
- verificar que el orden y copy coinciden con esta spec;
- revisar responsive basico mobile y desktop;
- verificar que no hay overflow horizontal evidente;
- revisar que no se agrego JavaScript nuevo;
- revisar que no se agregaron dependencias, imagenes, logos externos ni screenshots;
- revisar que no se implemento Spec 007;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.