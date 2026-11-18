# Landing Core reutilizable — Arquitectura futura

## Estado

**Pospuesto explícitamente hasta después del lanzamiento productivo de JonathanValdes.com.**

Este documento registra decisiones y acuerdos para recuperar el contexto cuando exista evidencia comercial para iniciar el trabajo. No crea un Core, una estructura física, un repositorio ni una dependencia nueva.

## Objetivo

El futuro Landing Core debe permitir construir landing pages independientes, útiles para productos, emprendimientos y clientes, reutilizando patrones validados de diseño y conversión sin convertirlos prematuramente en un framework complejo.

El resultado buscado es comercial: landing pages claras, accesibles, de bajo costo y fáciles de publicar que ayuden a captar clientes y generar ingresos.

## Decisiones aprobadas

1. Primero se finaliza y publica JonathanValdes.com.
2. Después se auditarán los componentes que hayan demostrado ser realmente reutilizables.
3. No se construirá un framework innecesariamente complejo.
4. No se acumularán repositorios sin propósito comercial comprobado.
5. El Core será ligero, modular y configurable.
6. Las landings generadas se mantendrán independientes entre sí.
7. Cada cliente o producto podrá tener identidad visual propia.
8. Las secciones podrán habilitarse o deshabilitarse mediante configuración.
9. Una landing publicada no cambiará automáticamente cuando evolucione el Core.
10. Se priorizarán HTML, CSS y JavaScript o un generador estático ligero; cualquier otra tecnología requerirá una necesidad concreta validada.
11. Hosting y mantenimiento deben mantenerse de bajo costo.
12. El diseño será mobile-first y accesible.
13. Las integraciones externas serán opcionales.
14. Cada landing podrá publicarse de forma independiente en Cloudflare Pages o AWS S3 + CloudFront.

## Componentes candidatos

Estos componentes son candidatos, no requisitos obligatorios del MVP:

| Componente | Función |
| --- | --- |
| Header | Identidad, navegación, menú móvil y CTA. |
| Hero | Titular, descripción, visual y acciones. |
| Servicios | Presentación de soluciones. |
| Selector de problemas | Orientación contextual opcional. |
| Proceso | Etapas de trabajo configurables. |
| Catálogo | Productos y aplicaciones. |
| Casos de estudio | Proyectos y resultados verificables. |
| Testimonios | Opiniones autorizadas. |
| Precios | Planes y servicios. |
| FAQ | Preguntas frecuentes. |
| Contacto | WhatsApp, formulario o agenda. |
| Footer | Información corporativa y enlaces legales. |

La inclusión de cada módulo debe responder a una necesidad del cliente o producto, no a una plantilla predeterminada.

## Arquitectura conceptual pendiente de validación

La siguiente separación es una alternativa de trabajo futura; no implica crearla ahora:

```text
Core reutilizable
├── componentes reutilizables
├── temas y tokens visuales
├── configuración de contenido
├── plantillas de composición
├── integraciones opcionales
└── generación de artefactos estáticos

Landing independiente por proyecto
├── contenido y recursos propios
├── tema propio
├── selección de secciones
├── artefacto estático versionado
└── despliegue independiente
```

Una posible organización de carpetas, por validar cuando exista el primer piloto, podría separar `core/`, `themes/`, `templates/`, `integrations/` y `projects/<landing>/`. Esta es solo una alternativa conceptual: el modelo definitivo dependerá de la auditoría de JonathanValdes.com y de una segunda landing real.

## Sistema visual

El Core futuro deberá permitir configurar, como mínimo:

- paletas;
- tipografías;
- espaciados;
- bordes y radios;
- botones;
- tarjetas;
- superficies;
- variantes de secciones;
- estados responsive.

La identidad **Tecnología contemporánea** de JonathanValdes.com es una referencia inicial de componentes y decisiones visuales, no una dependencia ni el tema obligatorio de futuras landings.

## Independencia, versionado y privacidad

- El Core debe seguir versionado semántico (`MAJOR.MINOR.PATCH`) cuando exista.
- Cada cliente o producto debe generar un artefacto estático independiente y versionable.
- Una actualización del Core solo llegará a una landing mediante una actualización controlada y explícita.
- Debe ser posible revertir una landing a un artefacto previo conocido.
- Datos, recursos y configuración de clientes deben permanecer separados.
- Los artefactos estáticos no deben incluir secretos ni información privada.
- El mantenimiento de una landing publicada no debe depender de cambios futuros en el Core.

## MVP futuro acotado

El primer MVP, si la validación comercial lo justifica, incluirá únicamente:

1. Tokens y temas.
2. Header.
3. Hero.
4. Servicios.
5. Tarjetas de proyectos o productos.
6. Contacto mediante enlace externo.
7. Footer.
8. Generación de un sitio estático independiente.

Quedan fuera del MVP: backend propio, CMS, editor visual, autenticación, base de datos, pagos, automatizaciones de infraestructura y un generador SaaS de autoservicio. Se evaluarán solo cuando exista demanda comercial concreta.

## Secuencia futura

1. **Finalizar y publicar JonathanValdes.com.**
2. **Auditar componentes existentes** e identificar patrones que se repiten y aportan valor.
3. **Extraer los primeros componentes** sin alterar el sitio publicado.
4. **Generar una segunda landing piloto** a partir del Core.
5. **Validar independencia, responsive, accesibilidad y publicación** de esa landing.
6. **Versionar y preparar el Core** para nuevas implementaciones comerciales.

## Riesgos y límites

- Extraer componentes antes de contar con un segundo caso real puede producir abstracciones equivocadas.
- Un sistema demasiado configurable puede costar más de mantener que una landing específica.
- Un nuevo repositorio solo estará justificado cuando exista un piloto y una responsabilidad clara de mantenimiento.
- Las integraciones externas no deben definir la arquitectura base de una landing estática.
- La reutilización debe preservar la identidad y necesidades comerciales de cada producto o cliente.

## Punto de inicio posterior al lanzamiento

Al publicar JonathanValdes.com, iniciar con una auditoría pequeña: inventariar componentes, identificar variantes reales, registrar qué se repite en una segunda landing candidata y decidir si el MVP reduce trabajo sin limitar la independencia de ambos proyectos. Solo entonces se aprobarán la tecnología, la estructura física y la estrategia de repositorio.
