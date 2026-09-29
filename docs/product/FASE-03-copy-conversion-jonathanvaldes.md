# FASE 3 — Copy y criterios de conversión

**Proyecto:** JonathanValdes.com  
**Estado:** APROBADA / CERRADA  
**Objetivo:** Definir el contenido comercial, narrativa, llamadas a la acción y principios de interacción de la nueva landing.

## 1. Objetivo de la landing

El objetivo principal de `jonathanvaldes.com` será generar:

> **Conversaciones comerciales cualificadas con empresas que tengan problemas tecnológicos reales que podamos resolver.**

Objetivos secundarios:

- generar contactos vía WhatsApp;
- generar reservas para reuniones de diagnóstico;
- mostrar capacidades técnicas;
- generar confianza;
- presentar problemas que el prospecto pueda reconocer;
- demostrar capacidad tecnológica mediante la propia experiencia del sitio.

La landing **no tendrá como objetivo buscar empleo**.

El contenido profesional destinado a entrevistas y reclutadores permanecerá separado en:

`jonathanvaldes.com/cv`

sin enlaces desde la landing comercial.

## 2. Públicos objetivo

### Cliente primario

Empresas pequeñas y medianas, principalmente no tecnológicas, con necesidades como:

- procesos manuales;
- sistemas desconectados;
- automatización;
- software pendiente por desarrollar;
- datos distribuidos o poco explotados;
- falta de dashboards o KPIs;
- infraestructura difícil de operar;
- falta de monitoreo;
- problemas de calidad de software.

Sectores posibles:

- salud;
- logística;
- construcción;
- inmobiliarias;
- retail;
- turismo;
- educación;
- servicios profesionales;
- contabilidad;
- industria;
- empresas de servicios.

### Cliente secundario

Empresas tecnológicas que necesiten capacidad adicional para:

- desarrollar un módulo;
- resolver integraciones;
- reforzar QA;
- trabajar DevOps;
- implementar Data/BI;
- automatizar procesos;
- incorporar observabilidad;
- sacar adelante un proyecto específico.

En estos casos la propuesta será:

> **Podemos hacernos cargo de una necesidad o proyecto concreto como proveedor tecnológico.**

## 3. Hero

### ¿Hay un problema tecnológico que tu empresa necesita resolver?

**Lo analizamos, diseñamos una solución y la llevamos a funcionamiento.**

Desarrollo, automatización, integraciones, cloud, datos, QA y monitoreo para empresas que necesitan avanzar sin ampliar innecesariamente su equipo tecnológico.

**CTA principal:** `Háblanos hoy`

Destino: WhatsApp.

**CTA secundario:** `Agenda hoy mismo`

Destino: sistema propio de reservas.

Texto de apoyo:

> Evaluación inicial sin compromiso · Demo/PoC cuando el caso lo permite.

## 4. Mensajes de confianza

Debajo del Hero podremos utilizar mensajes breves como:

- Hablamos directamente.
- Evaluamos antes de construir.
- Alcance y costos claros.
- Soluciones ajustadas al problema.

### Transparencia

La comunicación correcta será:

> **Cuando una prueba de concepto aporta valor para validar la solución, definimos un alcance claro antes de construirla.**

La demo no es una promesa automática ni sustituye el desarrollo completo.

Es una herramienta para validar técnicamente una solución cuando el proyecto lo justifica.

## 5. Componente dinámico — “¿Tu problema es...?”

Esta será una de las piezas visuales importantes de la landing.

Título fijo:

### ¿Tu problema es...

El contenido irá cambiando automáticamente:

- un proceso manual?
- sistemas desconectados?
- falta de visibilidad?
- una aplicación pendiente?
- infraestructura inestable?
- datos que no estás aprovechando?
- demasiados errores o pruebas manuales?

Después del ciclo:

> **Podemos ayudarte a convertirlo en una solución concreta.**

El cambio debe ser suave y rápido.

Requisitos:

- CSS y JavaScript mínimo;
- transición `opacity/transform`;
- respetar `prefers-reduced-motion`;
- el contenido debe seguir siendo comprensible si las animaciones están deshabilitadas.

## 6. Selector interactivo de problemas

### ¿Qué necesitas resolver?

Tarjetas:

- Automatizar un proceso
- Crear una aplicación
- Conectar sistemas
- Trabajar con mis datos
- Mejorar infraestructura
- Mejorar calidad
- Mejorar monitoreo / visibilidad
- No estoy seguro

Al seleccionar una opción se mostrará una respuesta contextual.

Ejemplo:

### Automatizar un proceso

> Podemos ayudarte a identificar tareas repetitivas, diseñar el flujo y evaluar qué partes pueden automatizarse sin complicar innecesariamente la operación.

CTA:

**Cuéntame tu caso**

Este texto se mantiene porque el cliente es quien nos contará su situación.

Al pulsarlo, WhatsApp podrá abrirse con un mensaje contextual, por ejemplo:

> Hola Jonathan, llegué desde tu sitio. Quiero evaluar la automatización de un proceso en nuestra empresa.

Cada categoría podrá utilizar su propio mensaje.

## 7. Representaciones visuales de soluciones

El sitio podrá utilizar pequeños diagramas animados para explicar soluciones sin agregar grandes cantidades de texto.

Ejemplos:

### Automatización

WhatsApp  
↓  
IA  
↓  
Agenda  
↓  
CRM

### Data

ERP → API → DATA → DASHBOARD

### DevOps

Código → Pruebas → Deploy → Monitoreo

### Integración

Sistema A → API → Sistema B

### Observabilidad

Aplicación → Métricas / Logs → Dashboard → Alertas

Requisitos técnicos:

- HTML;
- CSS;
- SVG;
- JavaScript mínimo.

Evitar videos pesados, WebGL o librerías grandes si no son necesarias.

## 8. Principio visual

La landing deberá:

> **Sorprender por claridad, interacción y calidad técnica, no por peso visual.**

La propia página debe funcionar como demostración indirecta de nuestras capacidades.

Se permiten:

- microinteracciones;
- SVG;
- diagramas;
- transiciones;
- hover;
- animaciones suaves;
- componentes interactivos;
- sticky sections;
- scrollytelling.

Se evitarán:

- videos grandes como background;
- animaciones 3D pesadas;
- WebGL sin justificación;
- parallax decorativo excesivo;
- múltiples librerías JavaScript;
- efectos que dificulten navegación;
- animaciones que afecten Core Web Vitals.

## 9. Proceso — sticky scrollytelling

La interacción `sticky + contenido que evoluciona con el scroll` se utilizará **solo en la sección “Cómo trabajamos”**.

El objetivo es que el proceso se vea de manera secuencial y sea difícil de ignorar, sin presentar siete bloques de texto simultáneos.

Cada paso se convierte en el foco visual mientras el usuario continúa desplazándose.

### 01 — Entendemos

Cuéntanos qué ocurre hoy, cuál es el problema y qué resultado necesitas.

### 02 — Analizamos

Revisamos procesos, sistemas existentes, restricciones y posibles alternativas.

### 03 — Proponemos

Definimos una solución proporcional al problema.

### 04 — Validamos

Cuando tiene sentido, construimos una pequeña PoC para validar la idea antes de desarrollar el proyecto completo.

### 05 — Definimos

Si decidimos avanzar, acordamos alcance, entregables, plazos y costos.

### 06 — Construimos

Implementamos de forma incremental y con objetivos claros.

### 07 — Acompañamos

Cuando corresponde, agregamos soporte, monitoreo o nuevas etapas.

#### Comportamiento esperado

- El título/número del paso se mantiene fijo durante su segmento.
- La explicación evoluciona con el scroll.
- Al finalizar el contenido, el siguiente paso toma el foco.
- Debe existir una alternativa lineal accesible en mobile o con movimiento reducido.
- No se repetirá este patrón en otras secciones para evitar saturación.

## 10. FAQ — acordeón con transición

La sección de preguntas frecuentes será opcional y ligera.

Solo se mostrará inicialmente la pregunta.

Al hacer clic o tocarla, la respuesta se desplegará suavemente debajo.

Esto es un **accordion con transición**:

- estado cerrado: solo la pregunta;
- estado abierto: pregunta + respuesta;
- animación corta de apertura/cierre;
- indicador visual como `+`, `–` o chevron;
- accesible mediante teclado;
- sin obligar al visitante a leer preguntas que no le interesan.

Preguntas iniciales:

### No sé qué tecnología necesito

No necesitas saberlo. Primero entendemos el problema y después evaluamos qué alternativa tiene sentido.

### ¿Cuánto cuesta una solución?

Depende del alcance, complejidad e integraciones. Primero entendemos la necesidad y luego separamos lo indispensable de posibles etapas posteriores.

### Ya tenemos equipo TI

Podemos colaborar sobre una necesidad puntual, integración o proyecto que el equipo interno no pueda abordar en ese momento.

### ¿Siempre hacen una demo?

No. La PoC se utiliza cuando permite validar una hipótesis técnica antes de desarrollar el proyecto completo.

### ¿Pueden continuar dando soporte?

Sí. Dependiendo del proyecto podemos definir soporte, monitoreo, mantenimiento o nuevas etapas.

## 11. Servicios

### Desarrollo de Software

Aplicaciones, APIs, sistemas internos y MVP para resolver procesos concretos.

### Automatización e IA

Automatización de tareas, workflows y soluciones con IA cuando existe un caso de uso real.

### Integraciones

Conexión entre aplicaciones, APIs, bases de datos y servicios que hoy trabajan separados.

### Cloud & DevOps

Infraestructura, AWS, Docker, CI/CD y automatización de despliegues.

### QA & Calidad

Testing, automatización y controles para reducir errores antes de producción.

### Data & Business Intelligence

ETL, integración de datos, SQL, reporting, dashboards y explotación de información.

### Monitoreo & Visibilidad

Métricas, logs, alertas, observabilidad, dashboards y KPIs para entender qué está ocurriendo.

## 12. Demo / PoC

### Valida la solución antes de invertir en el proyecto completo

> Algunos problemas pueden validarse antes de iniciar un desarrollo mayor.
>
> Cuando tiene sentido técnicamente, podemos definir una prueba de concepto acotada para comprobar una integración, automatización, flujo de datos, dashboard, API o prototipo.
>
> Su alcance se acuerda después de entender el problema y no representa el desarrollo completo del producto.

CTA:

**Evaluar mi proyecto**

## 13. Confianza

La confianza se construirá mediante:

### Experiencia transversal

Desarrollo + Cloud + QA + Data + automatización + observabilidad.

### Proyectos

Casos reales y demostraciones técnicas.

### Proceso claro

El prospecto sabe qué ocurre después del contacto.

### Transparencia

No se cotiza a ciegas ni se promete una solución antes de comprender el problema.

### Riesgo reducido

Primero se evalúa. Después se decide si existe un proyecto que tenga sentido desarrollar.

## 14. Uso de “yo” y “nosotros”

La voz se utilizará de forma deliberada.

### “Nosotros”

Se utilizará para:

- describir el método de trabajo;
- explicar cómo se aborda un proyecto;
- hablar de soluciones y procesos;
- permitir que la marca pueda evolucionar hacia colaboradores o una futura consultora.

Ejemplos:

> Entendemos el problema.  
> Evaluamos alternativas.  
> Construimos una solución.

### “Yo”

Se utilizará únicamente cuando Jonathan hable directamente de sí mismo o de la relación personal con el cliente.

Ejemplo:

> Soy Jonathan Valdés, Ingeniero en Informática.

Texto sugerido para la sección personal:

> Trabajas directamente conmigo durante el proceso y, cuando el proyecto lo requiere, podemos incorporar las capacidades necesarias para resolverlo correctamente.

Así la marca no aparenta un equipo que todavía no existe, pero tampoco queda limitada a un modelo individual para siempre.

## 15. Conversión

Se reducen los CTA a cuatro expresiones principales.

### CTA principal

**Háblanos hoy**

Destino: WhatsApp.

### CTA secundario

**Agenda hoy mismo**

Destino: reserva.

### CTA asociado al selector de problemas

**Cuéntame tu caso**

Destino: WhatsApp contextual.

### CTA relacionado con PoC

**Evaluar mi proyecto**

Destino: contacto / evaluación.

No se crearán múltiples variaciones innecesarias de CTA.

## 16. Extensión de la landing

Objetivo aproximado:

**900–1.300 palabras.**

Distribución recomendada:

- Hero: 40–60 palabras.
- Problemas: 6–7 mensajes de 15–25 palabras.
- Servicios: 7 × 20–30 palabras.
- Proceso: 7 pasos breves.
- Demo: 70–100 palabras.
- Casos: 3–4 tarjetas.
- Sobre mí: 80–100 palabras.
- FAQ: 4–5 preguntas.
- CTA final: 30–40 palabras.

El objetivo es evitar una landing que parezca un documento técnico o abrume al visitante.

## 17. Tono

La marca debe hablar de manera:

- profesional;
- simple;
- técnica cuando sea necesario;
- cercana;
- segura;
- transparente;
- orientada a resolver.

Evitar:

- exageraciones;
- “somos líderes”;
- promesas sin datos;
- buzzwords innecesarios;
- lenguaje excesivamente marketinero;
- falsa urgencia;
- aparentar un equipo que todavía no existe.

## 18. Métrica principal

La métrica principal será:

### Conversaciones comerciales cualificadas

Funnel:

Visitas  
↓  
Contactos  
↓  
Contactos cualificados  
↓  
Reuniones  
↓  
PoC  
↓  
Propuestas  
↓  
Contratos  
↓  
Facturación

Las tasas iniciales serán hipótesis hasta obtener datos reales.

## 19. Mensaje central

Si un visitante recuerda solamente una idea después de salir de la página, queremos que sea:

> **“Tengo un problema tecnológico. Puedo contarles mi caso, evaluarlo con Jonathan y decidir si vale la pena construir una solución.”**

## 20. Criterio de cierre

La Fase 3 queda cerrada con los siguientes acuerdos:

- Hero definido.
- CTA principal y secundarios definidos.
- Público primario y secundario definidos.
- Problemas y siete servicios definidos.
- Data & BI y Monitoreo & Visibilidad incorporados.
- Demo/PoC delimitada.
- Selector de problemas aprobado.
- Componente dinámico “¿Tu problema es...?” aprobado.
- Diagramas de flujo visuales aprobados.
- Sticky scrollytelling reservado exclusivamente para el proceso.
- FAQ definido como acordeón con transición.
- Uso de “yo” y “nosotros” definido.
- Extensión objetivo definida.
- SEO, confianza y tono definidos conceptualmente.
- Conversión orientada a conversaciones comerciales cualificadas.
- CV fuera del funnel comercial.

**Estado final: FASE 3 — APROBADA Y CERRADA.**

**Siguiente etapa: FASE 4 — Diseño / Wireframe.**
