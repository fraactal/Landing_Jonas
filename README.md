# JonathanValdes.com

Landing comercial estática de Jonathan Valdés. Su propósito es iniciar conversaciones con personas y organizaciones que necesitan resolver problemas tecnológicos mediante desarrollo, automatización, integraciones, cloud, QA, datos o monitoreo.

El sitio profesional anterior se conserva de forma independiente en la ruta [`/cv/`](./cv/). No forma parte del funnel comercial ni se enlaza desde la landing principal.

## Rutas

| Ruta | Propósito |
| --- | --- |
| `/` | Landing comercial. |
| `/cv/` | Sitio profesional histórico. |
| `/privacidad/` | Política de privacidad. |
| `/terminos/` | Términos de servicio. |

## Tecnologías

- HTML, CSS y JavaScript nativos para la landing.
- Python estándar para las pruebas unitarias del backend serverless.
- Terraform para la infraestructura futura en AWS.

La arquitectura de referencia es Cloudflare DNS → CloudFront → S3 para el frontend, con AWS Lambda, DynamoDB, SES y Google Calendar como integraciones backend cuando correspondan. No se despliega ni se configura infraestructura automáticamente desde este repositorio.

## Ejecutar en local

Desde la raíz del proyecto, usa un servidor HTTP estático. Por ejemplo, si tienes Python instalado:

```powershell
python -m http.server 8091 --bind 127.0.0.1
```

Luego abre:

- `http://127.0.0.1:8091/`
- `http://127.0.0.1:8091/cv/`

## Validaciones

Las pruebas backend no dependen de servicios AWS ni de credenciales:

```powershell
python -m unittest discover -s backend\tests -v
```

## Estructura

```text
assets/             Recursos de la landing comercial
backend/            Lambdas y pruebas unitarias de leads y reservas
cv/                 Sitio profesional histórico, aislado de la landing
docs/               Decisiones, arquitectura, operación y producto
infra/terraform/    Infraestructura declarativa futura
privacidad/         Ruta legal de privacidad
specs/              Especificaciones modulares SDD
terminos/           Ruta legal de términos
```

## Forma de trabajo

El proyecto usa Spec-Driven Development. Antes de implementar o modificar un módulo, revisa `AGENTS.md`, la spec aplicable en `specs/` y los documentos de fase de `docs/`. No se deben introducir frameworks, secretos en frontend, despliegues, merges o pushes sin una decisión e instrucción explícita.

## Seguridad y configuración

No subas credenciales, archivos `.env`, estados Terraform, configuraciones OAuth ni claves privadas. Están excluidos por `.gitignore`. Los endpoints de servicios externos deben configurarse por ambiente; el formulario heredado de `/cv/` permanece deliberadamente sin endpoint configurado.
