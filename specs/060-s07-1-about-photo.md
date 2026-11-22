# Spec 060 - S07.1: Foto en "Sobre mí" y texto más corto

Estado: Implementada.

## Objetivo
Reemplazar el círculo "JV" por una foto real de Jonathan (retrato de estudio con fondo oscuro, acorde a la banda azul oscuro de la sección) y quitar el párrafo central, que repetía al último.

## Alcance
- assets/images/jonathan-valdes.webp (720×900, ~18 KB), con width/height, loading=lazy y alt descriptivo.
- Marco con borde sutil y degradé suave inferior; en móvil formato cuadrado recortado desde arriba.
- Se elimina el párrafo "Trabajo combinando estas áreas...". Sin otros cambios de texto.
- Sin foto/fallo de carga: fondo del marco se mantiene (sin imagen rota visible).

## Aceptación
Foto sin deformación en PC y 390 px, sin desborde, contraste correcto del texto.
