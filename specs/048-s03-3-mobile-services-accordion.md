# Spec 048 - S03.3: Servicios como acordeón en móvil

Estado: Implementada.

## Objetivo
Mismo problema y solución que la spec 047 para "Soluciones tecnológicas".

## Alcance
- Menos de 48rem: se retiran los roles tablist/tab/tabpanel y se usa patrón acordeón (aria-expanded, aria-controls, panel region) con el panel bajo la opción elegida; cerrado al entrar; tocar la abierta la cierra.
- Escritorio mantiene tablist con navegación por flechas, Inicio y Fin.

## Criterios de aceptación
- Panel siempre inmediatamente bajo la opción tocada en móvil.
- Al cambiar el ancho de ventana se restauran roles y posición del panel.
- Sin errores de consola.

## Fuera de alcance
Contenido de los servicios.

## Nota
Implementada en el mismo commit que la spec 047 porque comparten helper y cambios de main.js y sections.css.
