# Sitio profesional en `/cv/`

Este directorio preserva el sitio profesional anterior como una ruta estática separada de la landing comercial.

## Origen

- Repositorio: `https://github.com/fraactal/Landing_Jonas`
- Rama: `main`
- Commit revisado: `cca552b825add2e6bc0a13e2572a83a1577e635c`

## Límites de la migración

Se migraron exclusivamente el HTML, CSS, JavaScript y assets del sitio público. La infraestructura Terraform, Lambda, IAM, archivos `.env`, configuraciones locales y secretos quedaron fuera. `assets/config.js` contiene un endpoint vacío de forma intencional; el formulario legado queda visualmente disponible, pero no está conectado a ningún servicio.
