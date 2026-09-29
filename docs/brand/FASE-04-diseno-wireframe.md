# FASE 4 — Diseño / Wireframe

**Proyecto:** JonathanValdes.com  
**Estado:** APROBADA / CERRADA  
**Objetivo:** Definir la identidad visual, sistema de componentes, jerarquía, responsive, interacciones y wireframe final de la nueva landing comercial.

## 1. Dirección visual

La landing debe proyectar:

> **Tecnología sofisticada presentada de manera simple.**

La sensación visual buscada es profesional, elegante, tecnológica, minimalista, confiable, con presencia y moderna sin depender de modas visuales. La referencia conceptual es una combinación de producto SaaS premium + consultoría tecnológica personal.

Evitar estética cyberpunk, exceso de neón, múltiples gradientes, sombras fuertes, demasiados iconos, cards excesivamente redondeadas, imágenes de stock genéricas, animaciones pesadas y efectos decorativos sin propósito.

## 2. Arquitectura visual definitiva

1. Navbar
2. Hero
3. Componente dinámico “¿Tu problema es...?”
4. Selector interactivo de problemas
5. Servicios
6. Cómo trabajamos — sticky scrollytelling
7. Demo / PoC
8. Casos / ejemplos
9. Sobre mí
10. FAQ — accordion
11. CTA final
12. Footer

La ruta `/cv` existe, pero NO forma parte del funnel comercial y no debe enlazarse desde la landing.

## 3. Navbar

Desktop:
- marca `Jonathan Valdés`;
- Soluciones;
- Cómo trabajamos;
- Proyectos;
- FAQ;
- CTA `Háblanos hoy`.

Comportamiento:
- sticky;
- fondo discreto;
- blur suave opcional;
- se compacta ligeramente al hacer scroll.

Mobile:
- nombre/marca;
- botón menú;
- menú con Soluciones, Cómo trabajamos, Proyectos, FAQ, Háblanos hoy y Agenda hoy mismo.

## 4. Hero

Layout recomendado desktop: 60/40.

Lado izquierdo:
- H1: `¿Hay un problema tecnológico que tu empresa necesita resolver?`
- subtítulo: `Lo analizamos, diseñamos una solución y la llevamos a funcionamiento.`
- descripción breve;
- CTA `Háblanos hoy`;
- CTA `Agenda hoy mismo`;
- texto: `Evaluación inicial sin compromiso · Demo/PoC cuando el caso lo permite.`

Mensajes de confianza opcionales:
- Hablamos directamente.
- Evaluamos antes de construir.
- Alcance y costos claros.
- Soluciones ajustadas al problema.

Lado derecho:
- diagrama SVG ligero;
- no usar stock photography.

## 5. Componente dinámico “¿Tu problema es...?”

Título fijo:
`¿Tu problema es...`

Textos rotativos:
- un proceso manual?
- sistemas desconectados?
- falta de visibilidad?
- una aplicación pendiente?
- infraestructura inestable?
- datos que no estás aprovechando?
- demasiados errores o pruebas manuales?

Cierre:
`Podemos ayudarte a convertirlo en una solución concreta.`

Requisitos:
- transición suave;
- CSS + JS mínimo;
- opacity / translate;
- intervalo aproximado 2.5–3 s;
- respetar `prefers-reduced-motion`;
- contenido comprensible sin animación.

## 6. Selector interactivo de problemas

Título:
`¿Qué necesitas resolver?`

Opciones:
1. Automatizar un proceso
2. Crear una aplicación
3. Conectar sistemas
4. Trabajar con mis datos
5. Mejorar infraestructura
6. Mejorar calidad
7. Mejorar monitoreo / visibilidad
8. No estoy seguro

Al seleccionar:
- mostrar explicación contextual;
- CTA `Cuéntame tu caso`;
- abrir WhatsApp con mensaje contextual;
- registrar el problema seleccionado como evento analítico cuando exista analytics.

## 7. Servicios

Siete líneas:
1. Desarrollo de Software
2. Automatización e IA
3. Integraciones
4. Cloud & DevOps
5. QA & Calidad
6. Data & Business Intelligence
7. Monitoreo & Visibilidad

Diseño:
- layout editorial;
- cards compactas;
- número visible;
- título;
- descripción breve;
- iconografía lineal;
- hover discreto.

## 8. Cómo trabajamos — sticky scrollytelling

Interacción visual principal.

Pasos:
1. Entendemos
2. Analizamos
3. Proponemos
4. Validamos
5. Definimos
6. Construimos
7. Acompañamos

Desktop:
- sección sticky;
- paso activo visible;
- contenido evoluciona con scroll;
- indicador vertical de progreso.

Mobile:
- alternativa lineal;
- sticky simplificado solo si mantiene usabilidad;
- priorizar accesibilidad.

No reutilizar sticky scrollytelling en otras secciones.

## 9. Demo / PoC

Bloque visual destacado.

Título:
`Valida antes de construir`

Flujo:
`IDEA → PoC → VALIDACIÓN → PROYECTO`

CTA:
`Evaluar mi proyecto`

La sección debe comunicar reducción de riesgo, no “trabajo gratis”.

## 10. Casos / ejemplos

Mostrar 3–4 casos visuales iniciales, por ejemplo:
- Automatización de reservas: `WhatsApp → IA → Agenda → CRM`
- Data y reporting: `ERP → ETL → Data → Dashboard`
- Infraestructura: `Código → CI/CD → AWS → Monitoreo`
- Aplicación empresarial: `Frontend → API → DB → Cloud`

Usar mini diagramas SVG y animación muy ligera.

## 11. Sobre mí

Sección breve:
- foto profesional real;
- nombre;
- título;
- experiencia transversal;
- mensaje de trabajo directo.

Texto conceptual:
`Soy Jonathan Valdés, Ingeniero en Informática con experiencia en desarrollo, cloud, QA, datos, automatización y observabilidad.`

`Trabajas directamente conmigo durante el proceso y, cuando el proyecto lo requiere, podemos incorporar las capacidades necesarias para resolverlo correctamente.`

No enlazar CV.

## 12. FAQ

Usar accordion con transición.

Requisitos:
- pregunta visible;
- respuesta oculta inicialmente;
- click/teclado;
- `aria-expanded`;
- relación control/panel;
- transición 200–300 ms.

Preguntas iniciales:
- No sé qué tecnología necesito.
- ¿Cuánto cuesta una solución?
- Ya tenemos equipo TI.
- ¿Siempre hacen una demo?
- ¿Pueden continuar dando soporte?

## 13. CTA final

Mensaje:
`¿Tienes algo que necesitas resolver?`

Apoyo:
`No necesitas tener definida la solución.`

CTA:
- `Háblanos hoy`
- `Agenda hoy mismo`

## 14. Footer

Versión inicial:

```text
Jonathan Valdés

Tecnología para convertir problemas, procesos e ideas
en soluciones que funcionan.

WhatsApp · Email

Privacidad · Términos de servicio

© 2026 Jonathan Valdés. Todos los derechos reservados.
```

Notas:
- no mostrar LinkedIn;
- WhatsApp y Email quedan genéricos hasta configurar valores reales;
- se deberá configurar `info@jonathanvaldes.com`;
- incluir `/privacidad` y `/terminos`.

## 15. Identidad visual

Estilo: Minimalista tecnológico premium.

Base: Dark mode.

Paleta:
- `#0B0D10` — fondo principal
- `#12161C` — superficies
- `#F4F6F8` — texto principal
- `#9AA4B2` — texto secundario
- `#4F7CFF` — acento
- `#8BA7FF` — acento suave
- `#242A33` — bordes

Tipografía:
- Manrope — títulos / números / H1–H3
- Inter — cuerpo / botones / formularios

## 16. Logo conceptual

Dirección:
- monograma `JV`;
- geométrico;
- simple;
- escalable;
- reconocible en favicon;
- puede incorporar conexión, nodo, flujo o integración;
- debe funcionar en monocromo.

La landing puede operar inicialmente con wordmark `Jonathan Valdés` si el isotipo todavía no está terminado.

## 17. Sistema de componentes

Botón primario:
- fondo `#4F7CFF`;
- texto de alto contraste;
- radio moderado;
- sin sombras fuertes.

Botón secundario:
- fondo transparente;
- borde tenue;
- hover con superficie ligera.

Cards:
- fondo `#12161C`;
- borde `#242A33`;
- radio 14–18 px;
- sombras mínimas;
- hover sutil.

Inputs:
- labels persistentes;
- focus visible;
- placeholder no reemplaza label.

Iconografía:
- lineal;
- monocromática;
- grosor consistente;
- sin emojis en UI final.

## 18. Interacciones destacadas

Solo tres interacciones visuales principales:
1. Texto dinámico “¿Tu problema es...?”
2. Selector interactivo de problemas
3. Sticky scrollytelling en “Cómo trabajamos”

Interacción secundaria:
4. FAQ accordion

No agregar nuevas interacciones importantes sin especificación aprobada.

## 19. Responsive

Enfoque: Mobile first.

Mobile:
- Hero apilado;
- CTA visibles;
- selector 1–2 columnas;
- servicios simples;
- proceso lineal o sticky simplificado;
- FAQ accordion;
- CTA final claro.

Se podrá evaluar CTA flotante de WhatsApp después de cierto scroll, nunca invasivo.

## 20. Performance

- sitio estático;
- JavaScript mínimo;
- cero videos de fondo;
- SVG para diagramas;
- imágenes optimizadas;
- lazy loading;
- animaciones CSS;
- sin librerías de animación obligatorias;
- evitar WebGL;
- evitar parallax decorativo;
- cuidar Core Web Vitals.

## 21. Accesibilidad

- HTML semántico;
- contraste suficiente;
- focus visible;
- navegación por teclado;
- ARIA donde corresponda;
- `prefers-reduced-motion`;
- textos alternativos;
- botones reales;
- no depender solo del color.

## 22. Wireframe final

```text
NAVBAR
  ↓
HERO
  ↓
¿TU PROBLEMA ES...?
  ↓
SELECTOR DE PROBLEMAS
  ↓
SERVICIOS
  ↓
CÓMO TRABAJAMOS
  ↓
DEMO / PoC
  ↓
CASOS / EJEMPLOS
  ↓
SOBRE MÍ
  ↓
FAQ
  ↓
CTA FINAL
  ↓
FOOTER
```

## 23. Criterio de cierre

La Fase 4 queda aprobada con:
- arquitectura visual;
- orden definitivo;
- identidad visual;
- paleta;
- tipografía;
- logo conceptual;
- sistema de componentes;
- wireframe;
- responsive;
- accesibilidad;
- performance;
- límites de interacción;
- footer;
- páginas legales previstas.

**Estado final: FASE 4 — APROBADA Y CERRADA.**

**Siguiente etapa: FASE 5 — Prompt Spec-Driven / preparación para Codex.**
