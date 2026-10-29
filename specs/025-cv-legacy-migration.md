# Spec 025 - Migración del sitio profesional a `/cv/`

Estado: Implementada.

## 1. Objetivo

Incorporar el sitio profesional previo de Jonathan Valdés como una ruta estática independiente en `/cv/`, conservando la landing comercial actual en `/` y sin convertir el CV en parte del funnel comercial.

## 2. Contexto

La fuente aprobada para esta migración es el repositorio público `fraactal/Landing_Jonas`, rama `main`, revisado en el commit `cca552b825add2e6bc0a13e2572a83a1577e635c`. La decisión 001 establece que la integración debía hacerse en un módulo propio, con inventario y exclusiones explícitas.

## 3. Alcance

- Crear la ruta estática `cv/index.html`.
- Migrar los estilos, JavaScript y assets necesarios para el funcionamiento visual del sitio anterior.
- Incluir una configuración pública vacía para el formulario legado, evitando una solicitud inexistente y la carga de un archivo local ignorado.
- Añadir `/cv/` al sitemap.
- Documentar el origen y las exclusiones de la migración.

## 4. Fuera de alcance

- Modificar la landing comercial, sus CTAs o su navegación.
- Enlazar `/cv/` desde la landing comercial.
- Migrar Terraform, Lambda, IAM, planes de despliegue o documentación de infraestructura del repositorio previo.
- Migrar secretos, `.env`, `terraform.tfvars`, estados Terraform, credenciales o `assets/config.js` local.
- Activar, adaptar o desplegar el formulario legado.
- Hacer push, merge o despliegue.

## 5. Criterios de aceptación

- `GET /cv/` devuelve el sitio profesional previo con sus recursos resueltos bajo `/cv/`.
- La landing comercial en `/` no se altera ni enlaza a `/cv/`.
- La ruta no incluye infraestructura ni configuraciones sensibles del repositorio fuente.
- El formulario legado presenta su estado de no configuración sin errores por recurso faltante.
- `sitemap.xml` incluye `https://jonathanvaldes.com/cv/`.
- Se validan las rutas locales principales y el estado Git queda limitado al módulo.

## 6. Deuda técnica no bloqueante

- El endpoint real del formulario legado no se transfiere: requerirá una decisión y configuración independiente si se vuelve a habilitar.
- Los documentos de infraestructura del repositorio original se conservan solo en su fuente histórica y no se tratan como arquitectura vigente de este proyecto.
