> **Actualización (Spec 073):** el sitio usa **contacto@jonathanvaldes.com**, que ya estaba configurado y activo en Cloudflare hacia jonathan.valdes.o@gmail.com. Esta guía queda como referencia para crear otras direcciones; donde dice `info`, léase `contacto`.

# Guía: correo info@jonathanvaldes.com con Cloudflare Email Routing

Objetivo: que lo que llegue a **info@jonathanvaldes.com** se reenvíe a **jonathan.valdes.o@gmail.com**.
Costo: gratis. Requisito: el DNS del dominio ya está en Cloudflare.

> Cloudflare Email Routing **solo recibe y reenvía**. Para *responder* como info@ hace falta el paso 5 (opcional).
> Los nombres de menú pueden cambiar; la referencia oficial es la documentación de Cloudflare (Email Service > Route emails).

## 1. Activar Email Routing en el dominio
1. Entra a dash.cloudflare.com e inicia sesión.
2. Menú lateral: **Compute** > **Email Service** > **Email Routing**.
3. Pulsa **Onboard Domain** y elige `jonathanvaldes.com`.
4. Antes de aceptar, revisa los registros DNS que Cloudflare añadirá en la raíz: **MX** (envían el correo entrante a Cloudflare), un **TXT de SPF** y un **TXT de DKIM**.
5. Pulsa **Done**. Los cambios de DNS suelen tardar 5–15 minutos (hasta 24 horas).

⚠️ Si ya tienes registros MX o un SPF en ese dominio (por ejemplo de otro proveedor), no los dupliques: un dominio debe tener **un solo** registro SPF. Revisa en DNS antes de aceptar.

## 2. Agregar y verificar el correo de destino
1. **Email Routing** > **Destination Addresses**.
2. Escribe `jonathan.valdes.o@gmail.com` y envíalo.
3. Abre ese Gmail, busca el correo de Cloudflare y pulsa **Verify email address**. (Revisa Spam si no aparece.)

Mientras no esté verificado, la regla queda deshabilitada.

## 3. Crear la dirección info@
1. **Email Routing** > selecciona tu dominio > pestaña **Routing Rules** > **Create routing rule**.
2. **Email pattern**: `info` (el dominio es `jonathanvaldes.com`).
3. **Action**: *Send to an email*.
4. **Destination**: `jonathan.valdes.o@gmail.com` (ya verificado).
5. **Save**.

## 4. Probar
Envía un correo a `info@jonathanvaldes.com` **desde otra cuenta** (no desde el mismo Gmail de destino). Debe llegar a tu Gmail; mira Spam si no aparece.

## 5. (Opcional) Responder como info@ desde Gmail
Gmail permite enviar "como" otra dirección:
1. Cuenta de Google > Seguridad: activar verificación en dos pasos y crear una **contraseña de aplicación**.
2. Gmail > Configuración (engranaje) > **Ver todos los ajustes** > pestaña **Cuentas e importación** > "Enviar como" > **Añadir otra dirección de correo**.
3. Nombre: Jonathan Valdés; correo: `info@jonathanvaldes.com`; deja marcado "Tratar como alias".
4. Servidor SMTP: `smtp.gmail.com`, puerto 587, TLS, usuario tu Gmail y la contraseña de aplicación.
5. Gmail enviará un código de confirmación a info@ (llegará a tu mismo Gmail por el reenvío). Ingrésalo.
6. Para que los correos enviados como info@ no caigan en spam, el registro **SPF** del dominio debe autorizar a Google. Como solo puede haber un SPF, se **edita el existente** para añadir `include:_spf.google.com` (lo hacemos juntos, con el valor real que tenga tu DNS).

## 6. Después
- Cambiar el correo en el sitio (contacto, footer, política de privacidad).
- Opcional: DMARC (`_dmarc`) para mejorar entregabilidad; lo vemos cuando el envío esté probado.

## Checklist
- [ ] Email Routing activado, registros MX/SPF/DKIM creados
- [ ] Destino verificado
- [ ] Regla `info@` creada y activa
- [ ] Prueba de recepción OK
- [ ] (Opcional) "Enviar como" configurado y probado
