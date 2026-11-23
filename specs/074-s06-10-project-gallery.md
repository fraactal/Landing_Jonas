# Spec 074 - S06.10: Galería ampliada de proyectos

Estado: Implementada.

- Al hacer clic (o Enter/Espacio) en una captura de catálogos, aplicaciones o Vesta ESG se abre un diálogo modal (`<dialog>`) con la galería del proyecto: título, contador, flechas, miniaturas, teclado (← → Esc), deslizar en móvil, cierre al tocar fuera y foco devuelto a la captura.
- Capturas con indicador de lupa y cursor de zoom. Imágenes largas (Emperatriz) se desplazan dentro del visor.
- Galerías ampliadas (versiones -lg): Checklist Auto (3), PasoUno (3), Vesta ESG (3: panel, administración, inicio de sesión). Los catálogos y Cera & Aroma / Finanzas Claras muestran sus capturas actuales.
- En la captura "Datos" de Checklist Auto se borró el nombre del vendedor.
- Mejora progresiva: sin JS o sin `<dialog>` la página se ve igual.
- Archivos: assets/js/gallery.js, CSS en sections.css.
