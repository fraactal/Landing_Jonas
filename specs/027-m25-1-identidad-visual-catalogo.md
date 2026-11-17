# Spec 027 - M25.1: identidad visual y catálogo comercial

Estado: Implementada.

## Objetivo

Preparar la landing comercial para revisión de lanzamiento mediante una identidad luminosa, un catálogo organizado según disponibilidad real y la definición visual/documental de un futuro acceso a demos privadas.

## Decisión documentada

La paleta oscura de Fase 4 se sustituye por instrucción explícita posterior del propietario. Se conserva la estructura, tipografías, rutas, CTAs principales, interacciones y el scrollytelling de siete pasos.

## Alcance

- Actualizar tokens semánticos y metadatos de color para la paleta marfil, arena, grafito, azul petróleo y terracota.
- Mantener `#proyectos` y ordenarlo en: catálogos comerciales publicados, aplicaciones públicas, demos/proyectos tecnológicos y en desarrollo.
- Enlazar solamente URLs verificadas durante este módulo.
- Preparar un bloque visual no funcional para futura solicitud de acceso a demos y documentar su contrato API.
- Ajustar privacidad para describir ese tratamiento como futuro, no activo.
- Documentar la futura separación de marca personal y marca de servicios sin implementarla.

## Fuera de alcance

- Backend, persistencia de emails, autenticación, analítica, despliegue, AWS, DNS, Terraform, nuevas rutas, dependencias y cambios en `/cv/`.
- Modificar aplicaciones externas, garantizar autorización de terceros o afirmar resultados comerciales.

## Criterios de aceptación

- La landing mantiene su estructura y las cuatro interacciones aprobadas; el proceso sticky de siete pasos no cambia.
- `/cv/` queda sin cambios y no se enlaza desde la landing.
- Los enlaces públicos responden correctamente; los no verificables no se publican como acceso directo.
- La captura de correo no simula envío ni almacenamiento.
- La política dice expresamente que el acceso a demos es futuro y requerirá aviso y consentimiento antes de activarse.
- El diseño funciona en móvil y escritorio sin instalar dependencias.

## Deuda técnica no bloqueante

- La autorización comercial y el propietario de cada catálogo deben confirmarse documentalmente antes de la publicación pública.
- Conectiva y Vesta ESG no estaban accesibles desde esta revisión; sus enlaces se mantienen fuera hasta verificarlos.
