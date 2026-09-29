# Spec 010 - About

## Estado

Implementada.

Esta spec define la seccion `Sobre mí` de `jonathanvaldes.com`. Fue implementada tras aprobacion explicita, sin JavaScript nuevo, dependencias, CTA propio, CV, LinkedIn, certificaciones, empleadores ni imagenes externas.

## 1. Objetivo

Definir una seccion breve para explicar quien esta detras del servicio, por que existe capacidad tecnica para abordar los problemas mostrados y como sera la relacion con el cliente.

La seccion debe responder rapidamente:

- quien es Jonathan Valdes;
- que experiencia transversal respalda la oferta;
- como trabaja directamente con el cliente;
- como puede incorporar capacidades adicionales si el proyecto lo requiere.

La seccion no debe transformarse en:

- curriculum;
- historial laboral;
- listado de empleadores;
- listado extenso de tecnologias;
- seccion orientada a busqueda de empleo.

## 2. Contexto

La landing comercial no busca empleo ni funciona como CV. El sitio profesional anterior se mantendra separado en `/cv` y no debe enlazarse desde la landing comercial.

La Spec 009 implemento `Casos / ejemplos`, mostrando capacidades y ejemplos genericos sin fingir clientes ni resultados. La Spec 010 debe continuar ese flujo agregando confianza personal: el visitante ya vio problemas, servicios, proceso, PoC y ejemplos; ahora necesita saber con quien conversara.

Fase 3 define que el uso de `yo` corresponde cuando Jonathan habla de si mismo o de la relacion directa con el cliente. Fase 4 define esta seccion como breve, con foto profesional real cuando exista, nombre, titulo, experiencia transversal y mensaje de trabajo directo.

## 3. Ubicacion

La seccion debe aparecer inmediatamente despues de `Casos / ejemplos` y antes de `FAQ`.

Orden esperado:

```text
Casos / ejemplos
↓
Sobre mí
↓
FAQ
```

En la implementacion futura, la seccion debe quedar dentro de `<main>` despues de `.cases`.

## 4. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion real `Sobre mí`;
- ubicarla inmediatamente despues de `Casos / ejemplos`;
- mantener la seccion breve y enfocada en confianza;
- usar voz en primera persona cuando Jonathan habla de si mismo;
- comunicar experiencia transversal sin convertirla en lista tecnica extensa;
- incluir el mensaje de relacion directa con el cliente;
- preparar un espacio visual para foto profesional futura;
- usar placeholder visual neutral si no existe foto real aprobada;
- no enlazar CV, LinkedIn ni curriculum;
- no agregar CTA propio;
- reutilizar tokens y componentes existentes;
- mantener mobile first;
- mantener accesibilidad y buen contraste;
- resolver idealmente con HTML + CSS;
- no agregar JavaScript nuevo;
- no agregar dependencias.

## 5. Fuera de alcance

No forma parte de esta spec:

- CV;
- `/cv`;
- enlace a CV;
- descarga de curriculum;
- LinkedIn;
- historial laboral detallado;
- empleadores anteriores;
- certificaciones;
- logos de empresas;
- barras de progreso;
- porcentajes de habilidades;
- anos falsos de experiencia;
- estrellas;
- badges;
- lista extensa de herramientas;
- FAQ;
- CTA final;
- Footer;
- contacto real;
- WhatsApp real;
- formularios;
- analytics;
- backend;
- paginas legales;
- Spec 011 o cualquier seccion posterior.

## 6. Titulo

Titulo preferido:

```text
Sobre mí
```

La implementacion futura puede usar una variante muy cercana si mejora la lectura, por ejemplo:

```text
Quién está detrás
```

Sin embargo, la opcion recomendada para M10 es mantener `Sobre mí` por claridad y coherencia con el wireframe aprobado.

Evitar titulos marketineros, exagerados o que parezcan seccion de agencia grande.

## 7. Copy

Copy base aprobado:

```text
Soy Jonathan Valdés, Ingeniero en Informática con experiencia en desarrollo, cloud, QA, datos, automatización y observabilidad.
```

Segundo bloque aprobado como base:

```text
Trabajo combinando estas áreas para entender problemas completos, no solo una parte técnica aislada.
```

Mensaje de relacion directa aprobado:

```text
Trabajas directamente conmigo durante el proceso y, cuando el proyecto lo requiere, podemos incorporar las capacidades necesarias para resolverlo correctamente.
```

Copy final propuesto para implementacion:

```text
Soy Jonathan Valdés, Ingeniero en Informática con experiencia en desarrollo, cloud, QA, datos, automatización y observabilidad.

Trabajo combinando estas áreas para entender problemas completos, no solo una parte técnica aislada.

Trabajas directamente conmigo durante el proceso y, cuando el proyecto lo requiere, podemos incorporar las capacidades necesarias para resolverlo correctamente.
```

Se permite ajustar ligeramente puntuacion o saltos de linea, pero no cambiar el significado ni transformar la seccion en CV.

## 8. Voz `yo/nosotros`

Esta seccion debe utilizar claramente el `yo` porque Jonathan habla de si mismo y de la relacion directa con el cliente.

Usar:

- `Soy Jonathan Valdés...`;
- `Trabajo combinando...`;
- `Trabajas directamente conmigo...`.

No usar plural artificial para hablar de experiencia personal.

El resto de la landing puede mantener `nosotros` para metodo, proceso, solucion y ejecucion. En M10, el cambio a primera persona es intencional y aprobado.

## 9. Experiencia transversal

La seccion debe comunicar experiencia en:

- desarrollo de software;
- Cloud / DevOps;
- QA y automatizacion;
- Data;
- automatizacion;
- observabilidad.

Puede incluir una linea breve de capacidades si aporta a la composicion:

```text
Desarrollo · Cloud · QA · Data · Automatización · Observabilidad
```

Reglas:

- mantener la lista corta;
- no agregar 25 herramientas;
- no dominar visualmente la seccion con tecnologias;
- no repetir todo lo ya comunicado en Servicios;
- usar capacidades como respaldo, no como catalogo.

## 10. Tratamiento de fotografia

La arquitectura visual aprobada contempla una foto profesional real, pero actualmente no existe una imagen aprobada dentro del repositorio.

La implementacion futura debe contemplar:

- espacio visual preparado para una foto futura;
- dimensiones estables para evitar layout shift;
- placeholder neutral y elegante si no existe asset real;
- marco ligero o superficie diferenciada coherente con el sistema visual;
- reemplazo simple por una foto real cuando exista.

No usar:

- imagen de stock;
- fotografia generada falsa;
- retrato inventado;
- imagen externa aleatoria;
- enlace remoto a una foto no controlada.

Si existe foto real al implementar M10:

- usar archivo local optimizado;
- preferir WebP/AVIF si corresponde;
- definir `width` y `height`;
- usar `loading="lazy"` si la posicion lo permite;
- usar `alt="Jonathan Valdés"`.

Si no existe foto real al implementar M10:

- usar placeholder decorativo local con HTML/CSS;
- no presentar el placeholder como fotografia;
- ocultarlo de tecnologias asistivas si no aporta informacion.

## 11. Mensaje de confianza

La seccion debe reforzar:

- contacto directo;
- amplitud tecnica;
- transparencia;
- capacidad de entender problemas completos;
- posibilidad de incorporar capacidades adicionales cuando el proyecto lo requiera.

No debe sugerir falsamente:

- una gran empresa detras;
- un equipo permanente no documentado;
- certificaciones no documentadas;
- clientes no documentados;
- experiencia laboral especifica no aprobada para la landing.

El objetivo es que el visitante entienda que conversara directamente con Jonathan y que la solucion no queda limitada a una sola area tecnica.

## 12. Layout

### Mobile

- una columna;
- visual/foto o placeholder primero si funciona bien visualmente;
- contenido despues;
- mucho espacio;
- lectura breve;
- sin overflow horizontal.

### Desktop

Preferencia:

- composicion aproximada 40/60;
- visual/foto a un lado;
- texto al otro;
- seccion relativamente compacta;
- espacio negativo suficiente;
- evitar sensacion de tarjeta de curriculum.

El orden DOM debe priorizar lectura comprensible. Si el layout visual mueve la foto a un lado, el texto debe seguir siendo entendible sin depender del orden visual.

## 13. Diseño

La seccion debe mantener la identidad:

- dark;
- elegante;
- minimalista;
- premium;
- sobria;
- tecnologica sin exceso decorativo.

Puede utilizar:

- superficie diferenciada;
- marco ligero para foto o placeholder;
- linea/acento sutil;
- composicion editorial;
- chips discretos de capacidades si no saturan.

No usar:

- tarjeta tipo curriculum;
- timeline laboral;
- logos de empleadores;
- decoracion excesiva;
- badges de certificacion;
- porcentajes o barras de habilidad;
- retrato falso;
- imagen de stock.

## 14. Accesibilidad

La implementacion futura debe incluir:

- seccion semantica con heading propio;
- heading asociado mediante `aria-labelledby` si corresponde;
- orden DOM logico;
- texto completo visible;
- contraste suficiente;
- no depender solo del color para comunicar jerarquia;
- foco visible si existiera algun elemento interactivo, aunque M10 no requiere interacciones;
- foto real con `alt="Jonathan Valdés"`;
- placeholder decorativo oculto correctamente si no aporta informacion.

No se requiere `aria-live`, accordion, tabs ni controles dinamicos.

## 15. Responsive

Enfoque obligatorio: mobile first.

La implementacion futura debe:

- partir en una columna;
- pasar a 40/60 en desktop si el ancho lo permite;
- evitar que el placeholder/foto cause layout shift;
- evitar textos demasiado largos por linea;
- mantener separacion clara con `Casos / ejemplos` y `FAQ`;
- evitar overflow horizontal;
- mantener la seccion compacta.

Reutilizar breakpoints existentes alrededor de `48rem` y `64rem` si hacen falta. No agregar breakpoints nuevos salvo necesidad concreta.

## 16. Performance

M10 debe ser liviana.

Requisitos:

- idealmente HTML + CSS;
- sin JavaScript nuevo;
- sin dependencias;
- sin imagen externa;
- sin nuevas fuentes;
- sin canvas, WebGL ni video;
- si existe foto real, optimizar WebP/AVIF cuando corresponda;
- definir dimensiones de imagen o placeholder para evitar layout shift;
- usar `loading="lazy"` si se incorpora imagen real y su posicion lo permite;
- reutilizar `assets/css/sections.css`;
- reutilizar tokens existentes.

No crear `assets/images/` salvo que exista una fotografia real aprobada que deba incorporarse.

## 17. Criterios de aceptacion

La futura implementacion de esta spec se considerara completa cuando:

- la seccion aparezca inmediatamente despues de `Casos / ejemplos`;
- no se implemente FAQ ni Spec 011;
- la seccion sea breve;
- la identidad de Jonathan sea claramente visible;
- se use correctamente `yo` para la experiencia personal;
- aparezca el copy base o una version equivalente aprobada;
- se comunique experiencia transversal;
- aparezca el mensaje `Trabajas directamente conmigo...` o equivalente aprobado;
- no exista historial laboral detallado;
- no existan empresas anteriores ni empleadores;
- no exista enlace a CV;
- no exista enlace a LinkedIn;
- no existan certificaciones no documentadas;
- no exista CTA adicional;
- no se use imagen de stock;
- no se use fotografia falsa o generada;
- si no hay foto real, se use placeholder visual neutral;
- la seccion sea responsive;
- la seccion sea accesible;
- no se agregue JavaScript nuevo;
- no se agreguen dependencias;
- no existan errores evidentes en una revision rapida.

## 18. Archivos previstos

La futura implementacion probablemente modificara:

```text
index.html
assets/css/sections.css
specs/010-about.md
```

Solo si existe una fotografia real aprobada dentro del flujo de trabajo, podria modificarse o agregarse:

```text
assets/images/
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

- Si no existe foto real, el placeholder puede sentirse incompleto; debe tratarse como estado temporal elegante.
- Usar demasiado copy tecnico puede convertir la seccion en CV y romper el foco comercial.
- Enlazar `/cv` o LinkedIn desviaria el funnel comercial aprobado.
- Mencionar empleadores, certificaciones o anos de experiencia sin documentacion podria crear confianza artificial.
- La frase sobre incorporar capacidades adicionales debe sonar transparente, no como si existiera una gran empresa detras.
- Cuando exista fotografia real, quedara pendiente optimizar formato, dimensiones y peso antes de produccion.
- El anchor `#faq` del navbar seguira pendiente hasta su spec correspondiente.

## 20. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- comprobar que la seccion aparece despues de `Casos / ejemplos`;
- comprobar que no se implementa FAQ ni Spec 011;
- verificar titulo `Sobre mí` o variante aprobada;
- verificar copy base y mensaje de relacion directa;
- verificar uso correcto de primera persona;
- verificar ausencia de enlaces a CV y LinkedIn;
- verificar ausencia de CTA adicional;
- verificar ausencia de empleadores, certificaciones y experiencia laboral detallada;
- verificar que no se usa imagen de stock ni imagen externa;
- verificar placeholder/foto con tratamiento accesible;
- revisar responsive basico mobile y desktop;
- verificar que no se modifico `assets/js/main.js`;
- verificar que no se agregaron dependencias;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.
