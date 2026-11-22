# Spec 063 - S09.1: Contacto con WhatsApp como vía principal y respaldo

Estado: Implementada.

## Objetivo
Un solo camino claro: botón grande de WhatsApp + un formulario corto. Si el formulario no tiene backend configurado (endpoint vacío), abre WhatsApp con el mensaje ya escrito. La agenda queda oculta hasta que exista el endpoint de reservas.

## Cambios
- Sección #contacto en dos columnas (PC) / apilada (móvil), según el diseño aprobado. Sin el texto "sin compromiso".
- Se quita el botón "Agenda hoy mismo" y los textos que lo mencionan; el panel de agenda se mantiene en el HTML con `hidden` y JS lo muestra solo si hay `booking-endpoint`.
- Formulario: mismos campos y mismo payload hacia el backend (sin romper el contrato); tarjeta clara sobre fondo oscuro.
- Sin endpoint: se abre WhatsApp con nombre, empresa, necesidad, mensaje y datos de contacto; con endpoint y error: mensaje con enlace a WhatsApp.
- Correo visible: info@jonathanvaldes.com (válido solo cuando se complete la guía docs/guias/correo-info-cloudflare.md; no publicar antes).

## Aceptación
Enviar el formulario sin endpoint abre WhatsApp con el texto; validaciones intactas; sin errores de consola; sin scroll horizontal a 390 px.
