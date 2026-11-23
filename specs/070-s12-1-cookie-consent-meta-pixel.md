# Spec 070 - S12.1: Aviso de cookies y Meta Pixel con consentimiento

Estado: Implementada (inactiva hasta configurar el ID del Pixel).

- `assets/js/consent.js`: sin ID en `DEFAULT_PIXEL_ID` no se muestra aviso, no se carga nada y el botón "Cookies" permanece oculto.
- Con ID: aviso con "Rechazar" y "Aceptar" de igual jerarquía; el Pixel (fbevents.js) se carga solo tras aceptar; decisión en localStorage (`jv_cookie_consent`); enlace "Cookies" / "Preferencias de cookies" para cambiarla.
- Eventos: PageView; Lead (envío del formulario, por endpoint o fallback a WhatsApp, vía evento `jv:lead` emitido por main.js); Contact (clic en WhatsApp o correo).
- Presente en index, privacidad y términos. Sección 5 de la política describe el uso.
- Verificado: sin aceptación, 0 solicitudes a Meta; aceptar carga; rechazar no carga; recarga respeta la decisión.
