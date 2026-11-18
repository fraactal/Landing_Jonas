# Spec 036 - S01.4 + S02.3: Limpieza visual de Hero y selector

Estado: Implementada.

## Objetivo
Retirar elementos visuales redundantes del Hero y del panel contextual del selector de problemas para simplificar la landing sin cambiar su funcionamiento.

## Alcance
- Eliminar el mensaje de apoyo y los tres chips del Hero, junto con sus estilos exclusivos.
- Eliminar la etiqueta `Respuesta contextual` del panel de detalle del selector y adaptar sus selectores CSS.
- Conservar CTAs, flujo visual de tres etapas, categorías, selección y respuesta contextual.

## Fuera de alcance
- Textos, lógica JavaScript, resto de las secciones, paleta, rutas, infraestructura y despliegue.
