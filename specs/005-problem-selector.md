# Spec 005 - Problem Selector

## Estado

Implementada.

Esta spec define el selector interactivo `¿Qué necesitas resolver?`. Fue implementada tras aprobacion explicita.

## 1. Objetivo

Definir el selector interactivo `¿Qué necesitas resolver?` de `jonathanvaldes.com` para que el visitante pueda identificar rapidamente el tipo de problema que tiene y recibir una respuesta contextual breve.

La seccion debe:

- mejorar claridad;
- aumentar identificacion;
- servir como puente hacia contacto;
- mantenerse simple;
- no parecer un formulario complejo;
- no exigir conocimiento tecnico;
- respetar la arquitectura visual y tecnica ya implementada.

La implementacion futura debe mantener la V1 como HTML, CSS y JavaScript vanilla minimo, sin dependencias ni backend.

## 2. Contexto

La Spec 002 dejo la base visual y tecnica de la landing.

La Spec 003 implemento Navbar y Hero.

La Spec 004 implemento la seccion dinamica `¿Tu problema es...?`, ubicada despues del Hero. La Spec 005 debe continuar inmediatamente despues de esa seccion con la segunda interaccion visual principal aprobada: el selector interactivo de problemas.

Fase 3 y Fase 4 aprobaron este selector como una pieza que ayuda al visitante a reconocer su situacion sin conocer la solucion tecnica. La comunicacion debe partir del problema y entregar orientacion breve, no vender tecnologia aislada.

## 3. Ubicacion

La seccion debe aparecer inmediatamente despues de la seccion dinamica `¿Tu problema es...?` y antes de Servicios.

Orden esperado:

```text
Hero
↓
¿Tu problema es...?
↓
¿Qué necesitas resolver?
↓
Servicios
```

En la implementacion futura, la seccion deberia quedar dentro de `<main>` despues de `.problem-prompt`.

## 4. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real titulada `¿Qué necesitas resolver?`;
- mostrar ocho opciones aprobadas como tarjetas seleccionables;
- usar botones reales para las opciones;
- partir sin ninguna opcion seleccionada inicialmente;
- mostrar un panel inicial con un mensaje breve;
- actualizar el panel al seleccionar una opcion;
- destacar visualmente la opcion activa;
- mostrar el CTA `Cuéntame tu caso` dentro del panel;
- mantener el CTA como placeholder controlado;
- preparar conceptualmente mensajes contextuales futuros por categoria;
- mantener responsive mobile first;
- reutilizar tokens y componentes existentes;
- usar JavaScript vanilla minimo en `assets/js/main.js`;
- no agregar dependencias, imagenes, fuentes, backend ni analytics reales.

## 5. Fuera de alcance

No forma parte de esta spec:

- WhatsApp real;
- numero telefonico real;
- correo real;
- formulario;
- modal complejo;
- backend;
- analytics reales;
- servicios;
- sticky process;
- Demo / PoC;
- casos;
- About;
- FAQ;
- CTA final;
- Footer;
- paginas legales;
- `/cv`;
- integracion de reservas;
- tracking de scroll o mouse;
- dependencias externas;
- librerias de componentes o animacion;
- Spec 006 o cualquier seccion posterior.

## 6. Opciones aprobadas

Usar exactamente estas categorias:

1. `Automatizar un proceso`
2. `Crear una aplicación`
3. `Conectar sistemas`
4. `Trabajar con mis datos`
5. `Mejorar infraestructura`
6. `Mejorar calidad`
7. `Mejorar monitoreo / visibilidad`
8. `No estoy seguro`

No agregar, renombrar ni eliminar categorias sin aprobacion explicita.

## 7. Copy contextual por opcion

Cada opcion debe actualizar el panel con una descripcion breve, clara y no excesivamente tecnica.

### Automatizar un proceso

```text
Podemos ayudarte a identificar tareas repetitivas, diseñar el flujo y evaluar qué partes pueden automatizarse sin complicar innecesariamente la operación.
```

### Crear una aplicación

```text
Podemos ayudarte a definir, diseñar y construir una aplicación, sistema interno, API o MVP que resuelva una necesidad concreta sin sobredimensionar el proyecto.
```

### Conectar sistemas

```text
Podemos ayudarte a integrar plataformas, APIs, bases de datos o servicios que hoy funcionan separados para que la información fluya con menos trabajo manual.
```

### Trabajar con mis datos

```text
Podemos ayudarte a consolidar, transformar y visualizar datos mediante reportes, dashboards o flujos que apoyen mejores decisiones del negocio.
```

### Mejorar infraestructura

```text
Podemos ayudarte a ordenar despliegues, cloud, Docker, CI/CD y automatización para que tu infraestructura sea más confiable y fácil de operar.
```

### Mejorar calidad

```text
Podemos ayudarte a reducir errores con pruebas funcionales, automatización, regresión y controles que den más confianza antes de publicar cambios.
```

### Mejorar monitoreo / visibilidad

```text
Podemos ayudarte a implementar métricas, logs, alertas y dashboards para entender qué está ocurriendo en tus sistemas y operación.
```

### No estoy seguro

```text
No necesitas saber la solución técnica. Podemos empezar entendiendo qué ocurre, qué necesitas lograr y qué alternativas tienen sentido para tu caso.
```

## 8. Estado inicial

La seccion debe iniciar sin ninguna opcion seleccionada.

El panel de detalle debe mostrar inicialmente:

```text
Selecciona una opción para explorar cómo podemos ayudarte.
```

No debe forzar una categoria por defecto. La interaccion comienza cuando el usuario elige.

## 9. Comportamiento

La seccion debe mostrar tarjetas seleccionables.

Al seleccionar una tarjeta:

- la opcion queda activa;
- se actualiza el estado visual de la tarjeta;
- el panel de detalle muestra el titulo y copy contextual de la opcion;
- aparece o permanece visible el CTA `Cuéntame tu caso`;
- el CTA conserva destino placeholder controlado;
- no se abre WhatsApp real;
- no se conecta backend;
- no se registran analytics reales.

La interaccion debe ser inmediata, simple y comprensible. No debe sentirse como un formulario largo ni exigir informacion adicional.

## 10. CTA

Texto exacto:

```text
Cuéntame tu caso
```

En M05 debe ser un placeholder controlado.

No usar:

- numero WhatsApp real;
- correo real;
- backend;
- modal complejo;
- formulario;
- integracion real de contacto.

Destino temporal recomendado:

```text
#contacto-pendiente
```

La spec deja preparado conceptualmente que en una fase futura el CTA pueda generar un mensaje contextual segun la categoria seleccionada.

Ejemplo futuro no implementado en M05:

```text
Hola Jonathan, llegué desde tu sitio y quiero evaluar un problema relacionado con automatización.
```

## 11. Cards

Cada tarjeta debe tener:

- numero o icono lineal simple;
- titulo de la opcion;
- estado hover;
- estado focus;
- estado seleccionado;
- area tactil razonable;
- suficiente contraste;
- texto sin cortes ni overflow.

No necesita descripcion completa dentro de cada card. La descripcion vive en el panel contextual.

Las tarjetas deben evitar saturacion visual. Pueden reutilizar la base de `.card` si aporta consistencia, pero deben seguir siendo controles reales, no `div` clickeables.

## 12. Panel de detalle

El panel de detalle debe:

- existir desde el estado inicial;
- mostrar un mensaje inicial cuando no hay seleccion;
- actualizarse con titulo y descripcion contextual al elegir una opcion;
- contener el CTA `Cuéntame tu caso`;
- mantener jerarquia visual clara;
- no parecer formulario ni modal;
- evitar saltos de layout incomodos;
- conservar una relacion clara con el grupo de opciones.

El panel puede ubicarse debajo del grid o lateralmente en desktop si mejora la composicion. En mobile debe ir despues del grid.

## 13. Accesibilidad

La implementacion futura debe incluir:

- botones reales para cada opcion;
- `aria-pressed` o patron equivalente apropiado para estado seleccionado;
- navegacion por teclado nativa;
- focus visible;
- relacion clara entre selector y panel de contenido;
- panel con identificador estable, por ejemplo `id="problem-selector-detail"`;
- referencia desde los controles hacia el panel cuando aporte claridad, por ejemplo `aria-controls`;
- no usar `div` clickeable sin semantica;
- no depender solo del color para indicar seleccion;
- evitar ruido innecesario al cambiar contenido;
- usar ARIA solo donde corresponda;
- mantener copy actualizado en el DOM para tecnologias asistivas.

No usar `aria-live` agresivo. Si se considera necesario anunciar cambios del panel, debe ser una region polite y justificada; la preferencia es mantener el cambio como resultado directo de la accion del usuario, sin anuncios repetitivos ni automaticos.

## 14. Animacion

Permitida solo de forma suave:

- cambio de borde;
- cambio de background;
- transicion leve del panel;
- `opacity` y `translateY` leve.

No usar:

- zoom fuerte;
- flip;
- 3D;
- carruseles;
- movimiento excesivo;
- animaciones que dificulten lectura;
- librerias de animacion.

Respetar `prefers-reduced-motion` desactivando o simplificando transiciones si corresponde.

## 15. Responsive

Enfoque obligatorio: mobile first.

### Mobile

- una columna por defecto;
- dos columnas solo si la legibilidad sigue siendo excelente;
- tarjetas con area tactil suficiente;
- panel despues del grid;
- sin overflow horizontal;
- sin texto cortado;
- evitar que el panel salte de forma incomoda.

### Desktop

- grid 4 x 2 o 2 x 4 segun espacio disponible;
- tarjetas compactas;
- panel de detalle debajo del grid o lateral si mejora composicion;
- evitar sobrecarga visual;
- mantener buen espacio negativo;
- composicion coherente con Hero y M04.

No crear breakpoints excesivos. Preferir `48rem` y `64rem` si se requieren.

## 16. Performance

La implementacion futura debe cumplir:

- JavaScript vanilla minimo;
- reutilizar `assets/js/main.js`;
- no agregar librerias;
- no agregar imagenes;
- no agregar dependencias;
- no crear bundles;
- no hacer fetch ni llamadas de red;
- no implementar backend;
- no implementar analytics reales;
- actualizar solo el DOM necesario al seleccionar una opcion.

## 17. Analytics futuro

M05 no debe implementar analytics.

Debe quedar preparada conceptualmente la posibilidad futura de registrar el evento:

```text
problem_selected
```

Valores sugeridos:

- `automation`
- `app`
- `integration`
- `data`
- `infrastructure`
- `quality`
- `monitoring`
- `unsure`

En una fase futura, el evento podria dispararse al seleccionar una tarjeta, siempre respetando la politica de no crear tracking excesivo.

## 18. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion sea visible despues de M04;
- exista el titulo `¿Qué necesitas resolver?`;
- se muestren exactamente las ocho opciones aprobadas;
- ninguna opcion este seleccionada inicialmente;
- el panel inicial muestre `Selecciona una opción para explorar cómo podemos ayudarte.`;
- todas las opciones sean controles accesibles;
- las tarjetas tengan estado hover, focus y seleccionado;
- la seleccion visual sea clara y no dependa solo del color;
- el panel contextual se actualice al seleccionar una opcion;
- cada opcion muestre su copy contextual aprobado;
- exista CTA `Cuéntame tu caso`;
- el CTA no conecte todavia a contacto real;
- el CTA use placeholder controlado;
- la navegacion por teclado funcione;
- la seccion sea responsive;
- no haya overflow horizontal;
- no se agreguen dependencias;
- no se agreguen imagenes;
- no se implemente analytics;
- no se implemente backend;
- no se implementen Servicios ni Spec 006;
- no existan errores de consola evidentes en una prueba local rapida;
- el menu mobile y la rotacion de M04 sigan funcionando.

## 19. Archivos previstos

La futura implementacion probablemente modificara:

```text
index.html
assets/css/sections.css
assets/js/main.js
specs/005-problem-selector.md
```

Modificar `assets/css/components.css` solo si existe una razon clara para generalizar algun patron reusable.

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

- Ocho tarjetas pueden saturar mobile si el espaciado o los tamanos tactiles no se cuidan.
- El panel puede generar saltos visuales si no se reserva espacio o si el copy varia demasiado.
- Usar `aria-live` sin cuidado podria generar ruido innecesario; preferir que el cambio sea resultado directo de la accion del usuario.
- El CTA contextual queda como placeholder hasta que exista contacto real.
- Los mensajes contextuales futuros para WhatsApp deberan definirse antes de conectar el canal real.
- Analytics `problem_selected` queda documentado para una fase futura y no debe implementarse en M05.
- Los anchors actuales del Navbar hacia secciones futuras siguen como deuda hasta que existan esas secciones.

## 21. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues de M04;
- comprobar que no se agrego Servicios ni Spec 006;
- revisar que existen exactamente ocho opciones;
- verificar estado inicial sin seleccion;
- verificar seleccion con mouse/touch;
- verificar navegacion por teclado y focus visible;
- verificar actualizacion del panel;
- verificar CTA placeholder;
- verificar que no hay WhatsApp real, backend ni analytics;
- verificar responsive basico mobile y desktop;
- revisar consola para errores evidentes;
- verificar que menu mobile y M04 siguen funcionando;
- `node --check assets/js/main.js` si se modifica JS;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.
