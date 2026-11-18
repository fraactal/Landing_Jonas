# Spec 034 - S02.1: Texto dinámico sin desplazamiento vertical

Estado: Implementada.

## Objetivo

Eliminar el desplazamiento vertical de la sección `¿Tu problema es...?` sin modificar frases, frecuencia ni comportamiento de rotación.

## Alcance

- Reservar con CSS Grid la altura intrínseca de la frase más extensa para cada ancho.
- Superponer la frase activa dentro de esa reserva y centrarla verticalmente.
- Mantener una sola frase visible y ocultar la referencia de reserva a tecnologías asistivas.
- No modificar JavaScript ni contenido de las frases.

## Fuera de alcance

- Hero, Header, S03-S10, proceso, `/cv`, paleta, controles o indicadores nuevos, funcionalidad e infraestructura.

## Criterios de aceptación

- La rotación no cambia la altura de la sección ni desplaza el contenido siguiente.
- Las frases se adaptan sin recortes entre 360 y 1440 px.
- La presentación con reducción de movimiento permanece estable.
