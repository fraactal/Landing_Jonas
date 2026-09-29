# JonathanValdes.com - SDD Roadmap

Este directorio contiene las especificaciones modulares para construir la nueva landing comercial de `jonathanvaldes.com` bajo Spec-Driven Development.

## Estado del proyecto

- Repositorio nuevo: `C:\Users\Jona\Documents\Proyectos\jonathanValdes.com`.
- Git root confirmado: `C:/Users/Jona/Documents/Proyectos/jonathanValdes.com`.
- La landing comercial vive en este repositorio.
- El sitio profesional anterior permanece fuera de este repositorio.
- La futura ruta `/cv` se integrara posteriormente mediante una spec propia y controlada.
- No se debe implementar ningun modulo sin aprobacion explicita de su spec.

## Fuentes de verdad organizadas

- `AGENTS.md`
- `docs/product/FASE-01-oferta-comercial.md`
- `docs/architecture/FASE-02-arquitectura-jonathanvaldes.md`
- `docs/product/FASE-03-copy-conversion-jonathanvaldes.md`
- `docs/brand/FASE-04-diseno-wireframe.md`

Ante conflictos, se mantiene la prioridad definida en `AGENTS.md`:

1. instruccion explicita mas reciente del usuario;
2. spec activa;
3. documentos de fase;
4. `AGENTS.md`;
5. implementacion existente.

## Limites del repositorio

- Este repo contiene la nueva landing comercial y su documentacion SDD.
- El sitio anterior no se copia ni se reutiliza automaticamente.
- `/cv` sera incorporado despues, cuando exista una spec aprobada para esa migracion.
- Ninguna configuracion legacy, endpoint, secreto, Terraform state o asset personal se incorpora sin revision explicita.
- Fase 2 es la fuente de verdad arquitectonica actual.

## Modulos

| Spec | Modulo | Proposito | Depende de | Puede trabajarse independiente |
| --- | --- | --- | --- | --- |
| 001 | Project backup and structure | Documentar estructura, limites del repo y preparacion para futura integracion de `/cv`. | Ninguna | No, es base del proyecto |
| 002 | Base layout and design system | Definir base HTML/CSS, tokens visuales, tipografias y reglas responsive. | 001, documentos de fase | No |
| 003 | Navbar and hero | Implementar primera impresion comercial y navegacion base. | 002 | No |
| 004 | Dynamic problem section | Implementar texto dinamico "Tu problema es..." con JS minimo. | 002, 003 | Parcialmente |
| 005 | Problem selector | Implementar selector contextual de problemas y CTA asociado. | 002, 004 | Parcialmente |
| 006 | Services | Presentar servicios sin inventar claims fuera de la oferta aprobada. | 002, docs de oferta | Si, despues de 002 |
| 007 | Process scrollytelling | Implementar "Como trabajamos" con sticky desktop y alternativa mobile. | 002 | Si, despues de 002 |
| 008 | PoC section | Presentar demo/PoC y CTA "Evaluar mi proyecto". | 002, docs de oferta | Si, despues de 002 |
| 009 | Cases | Presentar casos/ejemplos permitidos sin exagerar evidencia. | 002, docs de oferta/copy | Si, despues de 002 |
| 010 | About | Presentar "Sobre mi" alineado a la conversion, no como CV completo. | 002, docs de copy | Si, despues de 002 |
| 011 | FAQ | Implementar accordion accesible. | 002 | Si, despues de 002 |
| 012 | Final CTA footer | Implementar CTA final y footer aprobado con placeholders controlados. | 002, 003 | Parcialmente |
| 013 | Legal pages | Preparar rutas `/privacidad` y `/terminos` sin inventar contenido legal final. | 001, 002 | Si |
| 014 | SEO performance accessibility | Ajustar metadata, robots, sitemap, accesibilidad y performance. | 003-013 | No |
| 015 | Final integration review | Hardening integral, validaciones finales y deuda tecnica. | 001-014 | No |

## Orden recomendado

1. `001-project-backup-and-structure.md`
2. `002-base-layout-and-design-system.md`
3. `003-navbar-and-hero.md`
4. `004-dynamic-problem-section.md`
5. `005-problem-selector.md`
6. `006-services.md`
7. `007-process-scrollytelling.md`
8. `008-poc-section.md`
9. `009-cases.md`
10. `010-about.md`
11. `011-faq.md`
12. `012-final-cta-footer.md`
13. `013-legal-pages.md`
14. `014-seo-performance-accessibility.md`
15. `015-final-integration-review.md`

## Criterio general de finalizacion

Un modulo se considera finalizado solo cuando:

- su spec esta aprobada;
- los cambios se limitan al alcance declarado;
- no modifica decisiones aprobadas sin registrar una decision nueva;
- se ejecutan validaciones minimas proporcionales al riesgo;
- se documentan riesgos o deuda tecnica remanente;
- queda listo para un commit unico del modulo, sin push.

