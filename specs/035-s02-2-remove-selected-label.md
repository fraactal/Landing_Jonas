# Spec 035 - S02.2: Retirar etiqueta de selección

Estado: Implementada.

## Objetivo

Eliminar exclusivamente la etiqueta visual `Seleccionado` de las tarjetas del selector de problemas para evitar cortes y superposiciones.

## Alcance

- Retirar su HTML y CSS exclusivos.
- Restaurar la composición de número y título.
- Conservar `aria-pressed`, selección única, borde, fondo y número circular activos.

## Fuera de alcance

- Respuesta contextual, JavaScript, otras secciones, paleta, infraestructura y despliegue.
