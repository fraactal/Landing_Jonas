# Spec 054 - S00.3: Reducir espaciado vertical entre secciones

Estado: Implementada.

## Objetivo
Landing más compacta: padding de sección de clamp(4rem, 8vw, 7rem) a clamp(2.5rem, 5vw, 4.5rem) (máx. 72 px PC / 40 px móvil).

## Alcance
Solo token `--section-space` en tokens.css (con cache-bust). Sin cambios de contenido.

## Criterios de aceptación
- Secciones sin solaparse ni quedar pegadas; sticky de "Cómo trabajamos" y texto rotatorio sin cambios.
