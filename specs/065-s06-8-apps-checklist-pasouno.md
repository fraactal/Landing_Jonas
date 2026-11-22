# Spec 065 - S06.8: Capturas de Checklist Auto y PasoUno

Estado: Implementada.

## Objetivo
Pasar Checklist Auto y PasoUno de tarjetas de texto a ítems del zigzag de "Aplicaciones disponibles", con dos capturas reales cada uno.

## Alcance
- Capturas recortadas sin barra de estado ni de navegación del teléfono, WebP 366×740.
- Checklist Auto: prueba de manejo + calculadora de oferta (se omite la pantalla "Datos" por incluir el nombre de un vendedor).
- PasoUno: pantalla Hoy + Avance.
- Se elimina el bloque `project-list` que quedaba vacío.

## Aceptación
Sin scroll horizontal en 390 px; alt descriptivo; width/height declarados.
