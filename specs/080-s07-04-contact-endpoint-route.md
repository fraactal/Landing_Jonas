# Spec 080 - S07.04: Ruta correcta del endpoint de contacto

Estado: Implementada.

- La API HTTP `jonathanvaldes-contact-api` expone `POST /contact` (la raíz `/` responde 404). El formulario apunta a `https://w9psxxl2a7.execute-api.us-east-1.amazonaws.com/contact`.
- Requisito en AWS: configurar CORS en la API (orígenes jonathanvaldes.com y www, cabecera content-type, métodos POST y OPTIONS), porque la ruta no tiene OPTIONS.
