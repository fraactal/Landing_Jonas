# Spec 047 - S02.5: Selector de problemas como acordeón en móvil

Estado: Implementada.

## Objetivo
Que en móvil el detalle aparezca justo bajo la opción elegida, sin recorrer toda la lista.

## Alcance
- Menos de 48rem: las 8 opciones son un acordeón; cerradas al entrar; una abierta a la vez; tocar la abierta la cierra.
- La opción abierta se desplaza bajo el header (respeta prefers-reduced-motion).
- aria-expanded en móvil; indicador +/− visual.
- Escritorio sin cambios.

## Criterios de aceptación
- A 360, 390 y 768 px el detalle queda bajo la opción tocada.
- Teclado funcional (botones nativos), sin errores de consola.
- Volver a escritorio restaura la disposición original.

## Fuera de alcance
Textos, opciones u orden de la sección.
