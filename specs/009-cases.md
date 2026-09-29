# Spec 009 - Cases / Examples

## Estado

Implementada.

Esta spec define la seccion `Casos / ejemplos` de `jonathanvaldes.com`. Fue implementada tras aprobacion explicita, sin JavaScript nuevo, dependencias, CTA individuales, clientes reales no documentados ni metricas inventadas.

## 1. Objetivo

Definir una seccion visual y creible para mostrar que tipo de soluciones podemos construir, sin fingir clientes, resultados ni trayectoria comercial no documentada.

La seccion debe ayudar a que el visitante entienda capacidades concretas mediante ejemplos reconocibles, livianos y honestos.

Objetivos principales:

- aumentar confianza;
- mostrar variedad de soluciones;
- conectar servicios con ejemplos concretos;
- reforzar que el sitio puede resolver problemas reales;
- mantener transparencia comercial.

La seccion no debe convertirse en portafolio inflado ni en lista de clientes.

## 2. Contexto

La Spec 006 implemento `Servicios`, donde se presentan las lineas de solucion disponibles.

La Spec 008 implemento `Demo / PoC`, explicando que algunos problemas pueden validarse antes de iniciar un desarrollo mayor.

La Spec 009 debe continuar ese flujo mostrando ejemplos de soluciones posibles despues de `Demo / PoC` y antes de `Sobre mi`.

Fase 3 define que la confianza se construye mediante experiencia transversal, proyectos, proceso claro y transparencia. Fase 4 define que esta seccion debe mostrar 3-4 casos visuales iniciales con mini diagramas, sin imagenes de stock ni peso visual innecesario.

## 3. Ubicacion

La seccion debe aparecer inmediatamente despues de `Demo / PoC` y antes de `Sobre mi`.

Orden esperado:

```text
Demo / PoC
↓
Casos / ejemplos
↓
Sobre mi
```

En la implementacion futura, la seccion debe quedar dentro de `<main>` despues de `.poc`.

## 4. Anchor

La seccion debe usar el anchor estable:

```html
id="proyectos"
```

Esto hara funcional el enlace `Proyectos` del navbar:

```html
href="#proyectos"
```

No modificar el anchor futuro `#faq` en esta spec.

## 5. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real `Casos / ejemplos`;
- ubicarla inmediatamente despues de `Demo / PoC`;
- usar `id="proyectos"`;
- mostrar 3 o 4 tarjetas, con preferencia por 4;
- incluir ejemplos honestos, etiquetados como `Proyecto`, `Demo tecnológica` o `Caso de estudio`;
- incluir tipo, titulo, descripcion breve, flujo visual y categorias por tarjeta;
- usar diagramas simples con HTML/CSS o SVG inline ligero;
- reutilizar tokens y componentes existentes;
- mantener mobile first;
- mantener accesibilidad y buen contraste;
- no agregar JavaScript nuevo;
- no agregar dependencias;
- no inventar clientes, resultados, metricas, testimonios ni nombres comerciales no documentados.

## 6. Fuera de alcance

No forma parte de esta spec:

- paginas de detalle;
- screenshots;
- imagenes de stock;
- carruseles;
- modales;
- filtros;
- clientes reales no documentados;
- resultados comerciales no documentados;
- metricas de ahorro, conversion o rendimiento;
- testimonios;
- nombres de proyectos tratados como encargos de clientes si no estan documentados;
- CTA individual por tarjeta;
- botones `Ver proyecto` sin destino real;
- About / Sobre mi;
- FAQ;
- CTA final;
- Footer;
- contacto real;
- WhatsApp real;
- formularios;
- analytics;
- backend;
- paginas legales;
- Spec 010 o cualquier seccion posterior.

## 7. Principios de honestidad

La seccion debe ser explicita y cuidadosa con el origen de cada ejemplo.

No inventar:

- clientes;
- empresas;
- contratos;
- metricas;
- ahorros;
- conversiones;
- resultados comerciales;
- testimonios;
- certificaciones;
- nombres de proyectos como si fueran encargos de clientes si no lo fueron.

Los ejemplos deben poder etiquetarse como:

- `Proyecto`;
- `Demo tecnológica`;
- `Caso de estudio`.

Cuando no exista evidencia documentada dentro del repositorio, el caso debe presentarse como ejemplo conceptual, demo tecnica o capacidad de solucion, no como cliente real.

La implementacion futura no debe sugerir que todos los ejemplos fueron contratados por terceros.

## 8. Casos iniciales

Usar 4 tarjetas iniciales para equilibrar el layout desktop.

### Caso 1 - Automatización de reservas

Tipo:

```text
Demo tecnológica
```

Flujo visual:

```text
WhatsApp → IA → Agenda → CRM
```

Proposito:

Mostrar una solucion que automatiza atencion inicial, coordinacion de agenda y traspaso de informacion.

### Caso 2 - Data y reporting

Tipo:

```text
Caso de estudio
```

Flujo visual:

```text
Fuentes → ETL → Data → Dashboard
```

Proposito:

Mostrar integracion, transformacion y visualizacion de datos para facilitar seguimiento y toma de decisiones.

### Caso 3 - Infraestructura / DevOps

Tipo:

```text
Proyecto
```

Flujo visual:

```text
Código → CI/CD → AWS → Monitoreo
```

Proposito:

Mostrar automatizacion de despliegues, infraestructura y monitoreo para operar aplicaciones de forma mas controlada.

### Caso 4 - Aplicación empresarial

Tipo:

```text
Proyecto
```

Flujo visual:

```text
Frontend → API → DB → Cloud
```

Proposito:

Mostrar una aplicacion web conectada a backend, datos e infraestructura cloud.

## 9. Etiquetado

Cada tarjeta debe mostrar un tipo visible, con baja jerarquia pero suficiente claridad.

Tipos permitidos en M09:

```text
Proyecto
Demo tecnológica
Caso de estudio
```

Reglas:

- `Demo tecnológica` se usa cuando el ejemplo representa una demostracion o prototipo conceptual.
- `Caso de estudio` se usa cuando el ejemplo describe un patron de solucion sin afirmar cliente real.
- `Proyecto` se usa solo si no sugiere cliente, contrato ni resultado comercial no documentado.

Si al implementar aparece duda sobre la honestidad de un tipo, preferir `Demo tecnológica` o `Caso de estudio` antes que insinuar un encargo real.

## 10. Copy por caso

### 01 - Automatización de reservas

Tipo:

```text
Demo tecnológica
```

Titulo:

```text
Automatización de reservas
```

Descripcion:

```text
Una solucion para automatizar la atencion inicial, coordinar agenda y traspasar informacion relevante hacia un CRM o sistema interno.
```

Flujo:

```text
WhatsApp → IA → Agenda → CRM
```

Categorias:

```text
Automatización · IA · Integraciones
```

### 02 - Data y reporting

Tipo:

```text
Caso de estudio
```

Titulo:

```text
Data y reporting
```

Descripcion:

```text
Integracion, transformacion y visualizacion de datos para facilitar seguimiento operativo y apoyar la toma de decisiones.
```

Flujo:

```text
Fuentes → ETL → Data → Dashboard
```

Categorias:

```text
Data · ETL · Dashboards
```

### 03 - Infraestructura / DevOps

Tipo:

```text
Proyecto
```

Titulo:

```text
Infraestructura / DevOps
```

Descripcion:

```text
Automatizacion de despliegues, infraestructura cloud y monitoreo para operar aplicaciones de forma mas controlada.
```

Flujo:

```text
Código → CI/CD → AWS → Monitoreo
```

Categorias:

```text
Cloud · CI/CD · Monitoreo
```

### 04 - Aplicación empresarial

Tipo:

```text
Proyecto
```

Titulo:

```text
Aplicación empresarial
```

Descripcion:

```text
Aplicacion web conectada a backend, datos e infraestructura cloud para sostener procesos internos o servicios digitales.
```

Flujo:

```text
Frontend → API → DB → Cloud
```

Categorias:

```text
Software · API · Cloud
```

## 11. Layout

### Mobile

- una columna;
- tarjetas amplias y legibles;
- tipo, titulo, descripcion, flujo y categorias en orden claro;
- buen espacio vertical;
- sin overflow horizontal;
- diagramas que hagan wrap o se apilen si falta espacio.

### Desktop

- preferencia por 2 columnas;
- 4 tarjetas para equilibrar la grilla;
- tarjetas algo mas grandes que las de `Servicios`;
- mucho aire interno;
- evitar aspecto de catalogo denso;
- mantener ritmo visual coherente con `Servicios` y `Demo / PoC`.

No usar carrusel.

## 12. Visual / diagramas

Preferir diagramas simples basados en:

- HTML;
- CSS;
- SVG inline ligero solo si aporta claridad;
- nodos;
- lineas;
- etiquetas breves.

No usar:

- screenshots todavia, salvo que exista una razon clara y archivos reales;
- imagenes de stock;
- logos de herramientas;
- video;
- canvas;
- WebGL;
- librerias de animacion.

Cada flujo debe leerse visualmente como una cadena breve, por ejemplo:

```text
WhatsApp → IA → Agenda → CRM
```

Si el diagrama se marca como decorativo con `aria-hidden="true"`, debe existir texto equivalente visible o accesible dentro de la tarjeta.

## 13. Microinteracciones

Permitido:

- borde/acento sutil al hover;
- cambio leve de superficie;
- movimiento minimo de la tarjeta o diagrama;
- transiciones cortas y sobrias.

No usar:

- animaciones complejas;
- carruseles;
- parallax;
- efectos 3D;
- animaciones continuas;
- movimiento que compita con el scrollytelling ya implementado.

Con `prefers-reduced-motion: reduce`, evitar transformaciones innecesarias.

## 14. Accesibilidad

La implementacion futura debe incluir:

- seccion semantica con heading propio;
- heading asociado mediante `aria-labelledby` si corresponde;
- titulos semanticos por tarjeta;
- tipo de caso visible en texto;
- categorias visibles en texto;
- diagramas decorativos con `aria-hidden="true"` si corresponde;
- equivalente textual estable para cada flujo;
- contraste suficiente;
- no depender solo del color para comunicar jerarquia;
- orden DOM logico;
- no usar cards clickeables si no existe accion real;
- no incluir CTA rotos.

No se requiere `aria-live`, tabs, accordion, filtros ni estados interactivos complejos.

## 15. Responsive

Enfoque obligatorio: mobile first.

La implementacion futura debe:

- iniciar con una columna;
- pasar a 2 columnas en tablet/desktop si el ancho lo permite;
- evitar tarjetas excesivamente estrechas;
- permitir wrap controlado de diagramas;
- evitar texto truncado;
- evitar overflow horizontal;
- mantener tactilidad y lectura comoda.

Reutilizar breakpoints existentes alrededor de `48rem` y `64rem` si hacen falta. No agregar breakpoints nuevos salvo necesidad concreta.

## 16. Performance

La seccion debe ser liviana.

Requisitos:

- idealmente HTML + CSS;
- sin JavaScript nuevo;
- sin dependencias;
- sin imagenes pesadas;
- sin fetch ni llamadas de red;
- sin canvas, WebGL ni video;
- sin fuentes nuevas;
- diagramas con HTML/CSS o SVG inline ligero;
- reutilizar `assets/css/sections.css`;
- evitar layout shifts.

## 17. Navegacion

La implementacion futura debe hacer funcional el enlace `Proyectos` del navbar mediante:

```html
href="#proyectos"
```

La seccion debe incluir:

```html
id="proyectos"
```

No modificar `FAQ` todavia. El anchor `#faq` se resolvera en su propia spec.

## 18. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion aparezca inmediatamente despues de M08;
- la seccion tenga `id="proyectos"`;
- el link `Proyectos` del navbar funcione hacia esta seccion;
- existan 3-4 casos, con preferencia por 4;
- los casos iniciales respeten los nombres, tipos, flujos y descripciones de esta spec;
- ningun cliente sea inventado;
- ningun resultado, metrica, ahorro, conversion o testimonio sea inventado;
- cada tarjeta este correctamente etiquetada;
- cada tarjeta muestre tipo, titulo, descripcion, flujo visual y categorias;
- no existan CTA individuales ni botones `Ver proyecto` sin destino real;
- no se agregue JavaScript nuevo;
- no se agreguen dependencias;
- no se usen imagenes de stock;
- no se usen screenshots sin archivos reales y razon documentada;
- la seccion sea responsive;
- no exista overflow horizontal;
- la estructura sea semantica y accesible;
- los diagramas tengan equivalente textual;
- no se implemente Spec 010 ni secciones posteriores;
- no existan errores evidentes en una revision rapida.

## 19. Archivos previstos

La futura implementacion probablemente modificara:

```text
index.html
assets/css/sections.css
specs/009-cases.md
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

## 20. Riesgos / deuda tecnica

- La palabra `Proyecto` puede interpretarse como cliente real si no se presenta con cuidado.
- Los ejemplos deben seguir siendo honestos hasta que existan casos reales documentados dentro del repo.
- Los nombres futuros como Vesta ESG, Finanzas Claras, Recepcion IA Dental o Portafolio AWS/serverless pueden incorporarse solo cuando haya evidencia/documentacion local suficiente.
- El enlace `#faq` del navbar seguira pendiente hasta la spec correspondiente.
- Sin paginas de detalle, no debe existir CTA `Ver proyecto`.
- Los diagramas pueden saturar mobile si se fuerzan en una sola linea; deben permitir wrap o composicion vertical.
- Si en el futuro se agregan screenshots, deberan ser archivos reales, optimizados y con texto alternativo adecuado.

## 21. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues de M08;
- comprobar que `id="proyectos"` existe;
- comprobar que el link `Proyectos` del navbar apunta a `#proyectos`;
- verificar que existen 3-4 casos, preferentemente 4;
- verificar nombres, tipos, copy, flujos y categorias aprobados;
- verificar que no existen clientes, metricas, resultados ni testimonios inventados;
- verificar que no existen CTA individuales ni botones `Ver proyecto`;
- verificar que no se agrego JavaScript nuevo;
- verificar que no se agregaron dependencias ni imagenes de stock;
- revisar responsive basico mobile y desktop;
- revisar accesibilidad de headings, tarjetas, categorias y diagramas;
- verificar que no se implemento Spec 010;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.
