# Decision 001 - Repository boundaries and future `/cv` integration

## Estado

Aceptada.

## Fecha

2026-09-29

## Contexto

El proyecto `jonathanValdes.com` se movio a un repositorio propio en:

```text
C:\Users\Jona\Documents\Proyectos\jonathanValdes.com
```

El objetivo de este repositorio es construir la nueva landing comercial de `jonathanvaldes.com` bajo Spec-Driven Development.

El sitio profesional anterior existe fuera de este repositorio y debera conservarse en el futuro bajo `/cv`, sin formar parte del funnel comercial ni enlazarse desde la landing.

## Decision

1. La nueva landing comercial vive en el repositorio actual.
2. El sitio profesional anterior permanece separado y fuera de este repo por ahora.
3. La ruta `/cv` se integrara posteriormente mediante una spec propia y controlada.
4. La fuente exacta del sitio anterior para `/cv` se decidira recien en el modulo futuro de migracion.
5. Esta decision no bloquea el desarrollo de la landing comercial en `/`.
6. Ninguna configuracion legacy se reutilizara automaticamente.
7. La arquitectura aprobada en Fase 2 tiene prioridad sobre cualquier documentacion legacy contradictoria.

## Consecuencias

- Spec 002 puede comenzar sobre una base limpia sin depender de la migracion de `/cv`.
- Cualquier incorporacion futura de archivos legacy debera excluir secretos, Terraform state, caches locales y configuraciones no revisadas.
- El modulo futuro de `/cv` debera definir respaldo, inventario, fuente canonica, exclusiones y validaciones antes de copiar archivos.
- La landing comercial no debe enlazar `/cv`.

## Riesgos no bloqueantes

- La fuente exacta del sitio anterior todavia no esta elegida.
- Configuraciones antiguas de contacto, infraestructura o despliegue pueden no coincidir con Fase 2.
- La migracion de `/cv` necesitara una revision propia antes de ejecutarse.

