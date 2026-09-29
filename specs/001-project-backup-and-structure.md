# Spec 001 - Project Backup and Structure

## Estado

Implementada.

Esta spec prepara el repositorio nuevo para comenzar la construccion de la landing comercial bajo SDD. No implementa la landing, no crea `/cv` y no incorpora archivos del sitio anterior.

## Objetivo

Documentar el estado actual del nuevo repositorio `jonathanValdes.com`, fijar sus limites respecto del sitio profesional anterior, dejar preparada una estructura documental limpia y registrar las decisiones necesarias para comenzar la Spec 002 sin poner en riesgo el sitio previo.

## Contexto

La raiz `/` de `jonathanvaldes.com` sera una landing comercial orientada a generar conversaciones comerciales cualificadas. El sitio profesional anterior se conservara posteriormente en `/cv`, separado del funnel comercial y sin enlaces desde la landing.

El proyecto nuevo vive en:

```text
C:\Users\Jona\Documents\Proyectos\jonathanValdes.com
```

El Git root confirmado para este proyecto es:

```text
C:/Users/Jona/Documents/Proyectos/jonathanValdes.com
```

El sitio anterior permanece fuera de este repositorio. Su fuente exacta para la futura ruta `/cv` se decidira recien cuando se ejecute el modulo de migracion correspondiente. Esa decision no bloquea el desarrollo de la nueva landing comercial.

## Fuentes de verdad leidas

Antes de implementar esta spec se leyeron:

- `AGENTS.md`
- `docs/product/FASE-01-oferta-comercial.md`
- `docs/architecture/FASE-02-arquitectura-jonathanvaldes.md`
- `docs/product/FASE-03-copy-conversion-jonathanvaldes.md`
- `docs/brand/FASE-04-diseno-wireframe.md`
- `specs/001-project-backup-and-structure.md`

## Estructura actual del repositorio

```text
jonathanValdes.com/
├── .git/
├── .gitignore
├── AGENTS.md
├── docs/
│   ├── architecture/
│   │   ├── .gitkeep
│   │   └── FASE-02-arquitectura-jonathanvaldes.md
│   ├── brand/
│   │   ├── .gitkeep
│   │   └── FASE-04-diseno-wireframe.md
│   ├── decisions/
│   │   ├── .gitkeep
│   │   └── 001-repository-boundaries-and-cv.md
│   └── product/
│       ├── .gitkeep
│       ├── FASE-01-oferta-comercial.md
│       └── FASE-03-copy-conversion-jonathanvaldes.md
└── specs/
    ├── 001-project-backup-and-structure.md
    └── README.md
```

## Alcance implementado

- Se mantuvo el nuevo proyecto aislado en su propio repositorio Git.
- Se documento la estructura actual del repositorio.
- Se registro que la landing comercial vive en este repo.
- Se registro que el sitio profesional anterior permanece fuera de este repo.
- Se dejo documentado que `/cv` sera una integracion futura y controlada.
- Se registro que ninguna configuracion legacy se reutilizara automaticamente.
- Se registro que Fase 2 es la fuente de verdad arquitectonica actual.
- Se dejo una decision formal en `docs/decisions/` para guiar el trabajo posterior.

## Fuera de alcance respetado

No se realizo ninguna de estas acciones:

- comparar versiones del sitio anterior;
- inspeccionar en detalle carpetas legacy;
- elegir una fuente canonica para `/cv`;
- copiar el sitio anterior dentro del nuevo repo;
- crear `/cv`;
- modificar el sitio anterior;
- tocar Terraform state;
- copiar `.terraform/`;
- copiar `terraform.tfvars`;
- copiar secretos;
- desplegar;
- crear HTML/CSS/JS comercial;
- comenzar la Spec 002;
- cambiar la arquitectura aprobada.

## Decisiones arquitectonicas relevantes

La fuente de verdad arquitectonica actual es `docs/architecture/FASE-02-arquitectura-jonathanvaldes.md`.

Decisiones vigentes para V1:

- Frontend estatico prioritario: HTML, CSS y JavaScript liviano.
- No usar frameworks sin necesidad tecnica documentada y aprobada.
- Hosting objetivo: Cloudflare DNS -> CloudFront -> S3.
- Backend futuro: Frontend -> Lambda Function URL -> Lambda -> SES / DynamoDB / Google Calendar API / Meet.
- API Gateway queda fuera de V1 salvo necesidad futura documentada.
- No usar EC2 permanente para landing ni reservas.
- No usar SQLite sobre S3 como base transaccional.
- `/cv` se conserva como ruta futura para el sitio profesional y no forma parte del funnel comercial.

## Preparacion para `/cv`

- El sitio profesional anterior se mantiene por ahora fuera del nuevo repositorio.
- La integracion en `/cv` sera una tarea futura con spec propia.
- La seleccion de la fuente exacta del sitio anterior se decidira en ese modulo futuro.
- El modulo futuro debera definir respaldo, inventario, exclusiones y validaciones antes de copiar cualquier archivo.
- Esta decision no bloquea la construccion de la landing comercial en `/`.

## Configuracion legacy

Ninguna configuracion antigua se reutilizara automaticamente.

Antes de incorporar cualquier elemento legacy se debera revisar de forma explicita:

- endpoints de contacto;
- configuracion de Turnstile o antispam;
- variables de entorno;
- configuracion AWS;
- Lambda existente;
- Terraform existente;
- assets personales;
- enlaces de correo, WhatsApp, LinkedIn u otros canales.

La nueva landing debe usar placeholders controlados hasta que exista una configuracion aprobada para canales reales.

## Riesgos / deuda tecnica no bloqueante

- Falta una spec futura para migrar el sitio profesional anterior a `/cv`.
- Falta decidir la fuente exacta del sitio anterior cuando se ejecute el modulo de `/cv`.
- Existe documentacion legacy que podria contradecir la Fase 2; ante conflicto, Fase 2 tiene prioridad.
- La configuracion de contacto, agenda, Lambda, SES, DynamoDB y Google Calendar debera tratarse en specs futuras.
- Aun no existe estructura de archivos de la landing comercial; se definira desde Spec 002.

## Criterios de aceptacion

- Existe `specs/001-project-backup-and-structure.md` actualizado.
- Existe `specs/README.md` con roadmap tecnico por modulos.
- Existe `docs/decisions/001-repository-boundaries-and-cv.md`.
- Las fuentes de verdad aprobadas estan organizadas en `docs/`.
- La separacion entre repo nuevo y sitio anterior esta documentada.
- La futura integracion de `/cv` esta documentada como tarea controlada posterior.
- No se implemento la landing comercial.
- No se creo `/cv`.
- No se copiaron archivos legacy.
- No se ejecutaron deploys, Terraform, auditorias extensas ni validaciones largas.

## Validaciones rapidas realizadas

- Lectura de fuentes de verdad.
- `git status --short --branch` antes de modificar.
- `git rev-parse --show-toplevel` para confirmar el Git root.
- Inventario rapido de la estructura del repositorio nuevo.

