# Spec 030 - S02: Refinamiento del selector de problemas

Estado: Implementada.

## Objetivo

Refinar exclusivamente el selector de problemas para hacer inequívoca su selección, explicar cada caso en lenguaje comercial sencillo y conducir de forma segura al contacto existente.

## Alcance

- Mantener exactamente ocho opciones, con `Trabajar con datos` como etiqueta visible.
- Reforzar el estado seleccionado con borde azul eléctrico, fondo suave, numeración y texto visible de selección.
- Mostrar título, explicación, propuesta concreta y CTA `Conversemos sobre esta solución` solo después de seleccionar una opción.
- Conservar la opción seleccionada en memoria de página.
- Enlazar el CTA a `#contacto` y preseleccionar el tipo de problema solo si el campo compatible sigue vacío.
- Mantener botones nativos, `aria-pressed`, foco visible, respuesta semántica y movimiento reducido.

## Fuera de alcance

- S00, S01 y S03-S10; proceso de siete pasos; catálogo; `/cv`; paleta global; backend; almacenamiento persistente; analytics; APIs; infraestructura y despliegue.

## Criterios de aceptación

- No hay opción activa ni CTA contextual visible inicialmente.
- Las ocho opciones siguen siendo las únicas disponibles.
- Cada selección actualiza título, explicación y propuesta sin depender solo del color.
- El CTA navega a `#contacto`, conserva la selección y no sobrescribe un valor existente en el formulario.
- El grid es de una columna en móvil, conserva sus cuadrículas existentes desde 768 px y no presenta desbordamiento horizontal.
- No se modifica contenido ni comportamiento de otras secciones.
