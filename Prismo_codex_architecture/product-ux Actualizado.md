---
title: "Prismo — Product Storytelling y UX/UI"
subtitle: "Blueprint de experiencia, marca y diseño de interfaz · Identidad Prismo"
author: "Documento de trabajo del proyecto"
date: "12 de noviembre de 2026"
lang: "es-MX"
---

# Product Storytelling y UX/UI

**Identificador:** UX-DATOS-001  
**Versión:** 1.2 — visión de producto actualizada; identidad visual conservada · línea base de trabajo  
**Documento fuente:** SRS-DATOS-001, versión 1.0 (11/11/2026)  
**Tipo de entrega:** visión narrativa, arquitectura de información, recorridos, principios de interacción y lineamientos UX/UI  
**Nombre comercial:** **Prismo**, aprobado por el responsable del proyecto el 12/11/2026. «ImpactLens» permanece únicamente como nombre histórico de exploración.  
**Archivo del logo aprobado:** `PrismoLogo` (en el paquete de referencia se incluye `PrismoLogo.png`).  
**Documento previo:** `Blueprint_Product_Storytelling_UX_v1.0.md`; se conserva como versión histórica.

> **Principio rector:** de una pregunta a un reporte profesional, sin perder la procedencia de los datos ni el control editorial. La interfaz debe distinguir siempre hechos provenientes de fuentes oficiales de las interpretaciones redactadas por una persona.

**Registro de actualización v1.1 (12/11/2026):** el usuario seleccionó **Prismo** como nombre, aprobó un **isotipo sin texto** identificado como `PrismoLogo`, definió el estilo **elegante y moderno** y fijó la paleta de seis colores presentada en la sección 9. El resto del SRS y los recorridos se preservan; la identidad comercial debe incorporarse a una futura revisión del SRS, sin modificar retrospectivamente su v1.0.

**Recurso de marca:** `PrismoLogo.png` acompaña el proyecto en `assets/PrismoLogo.png` (ruta relativa desde este Markdown: `../assets/PrismoLogo.png`) como referencia visual. Si el archivo se usa fuera del paquete, adjuntar también el logo. El nombre `PrismoLogo` no implica que exista ya una versión SVG vectorial.


**Registro de actualización v1.2 (12/11/2026):** se adopta como definición de producto la investigación asistida para personas que **informan y elaboran estudios de cambios e impactos sociales y ambientales**. La utilidad económica y financiera sigue disponible dentro del catálogo de diez categorías, pero funciona como contexto o caso complementario. Se prioriza ahorrar tiempo al autor durante la recolección, consulta y visualización de evidencias oficiales, para que dedique más tiempo a la escritura con criterio propio. La presencia de datos «actuales» se define como **última observación publicada por la fuente al momento de la consulta**, no necesariamente un valor del día. Se excluyen de esta fase decisiones sobre dominios y disponibilidad legal del nombre. Los demás ajustes de producto podrán discutirse después de tener un prototipo funcional.

## Definición de producto aprobada (v1.2)

> **Prismo es una plataforma web que ayuda a estudiantes, investigadores, comunicadores y organizaciones a elaborar reportes sobre cambios e impactos sociales y ambientales mediante la recolección automatizada de datos de fuentes oficiales, su organización en dashboards y la creación de documentos con evidencia verificable.** Al centralizar la búsqueda y consulta de indicadores, Prismo reduce tiempo operativo para que el autor se concentre en analizar, escribir y comunicar hallazgos. El usuario conserva la selección de evidencia, interpretación, redacción y conclusiones.

**Propuesta editorial corta:** «Menos tiempo buscando datos. Más tiempo contando lo que significan.»

**No promete:** descubrir toda fuente de internet, producir conclusiones por IA, actualizar diariamente series que solo se publican cada año, o afirmar impactos causales sin respaldo. Prismo facilita la *investigación de fuentes aprobadas*, no reemplaza investigación cualitativa ni juicio experto.

**Prioridad de escenarios para el prototipo:** 1) un estudio social o ambiental con comparación y referencias; 2) un reporte económico de contexto; 3) un informe especializado financiero. El catálogo aprobado de diez categorías permanece.

## 1. La historia que contará el producto

### 1.1 Problema humano, no problema de dashboards

Una estudiante necesita comparar condiciones educativas entre entidades; un analista financiero debe preparar un panorama económico regional; una organización necesita contextualizar un problema ambiental. Hoy encuentran datos en portales dispersos y con diferentes unidades, periodos y metodologías. Copian valores, generan gráficas, pasan al procesador de textos, reconstruyen citas y corren el riesgo de presentar cifras fuera de contexto.

El trabajo no consiste solamente en encontrar un número: consiste en **convertir evidencia verificable en una explicación comunicable**. La experiencia reducirá fricción entre descubrir un indicador, comprender sus límites, visualizarlo, citarlo y redactar el reporte.

### 1.2 Promesa de producto

**Menos tiempo buscando datos. Más tiempo contando lo que significan.**

Subpromesa: **Investiga con evidencia. Analiza con claridad. Redacta con control.**

El producto no promete «hacer la investigación por ti» ni generar conclusiones mediante IA en V1. Promete concentrar herramientas que normalmente están separadas y mantener la trazabilidad entre gráfica, fuente y documento final.

### 1.3 Pitch en 30 segundos

Plataforma web responsive orientada a estudios e informes sobre cambios e impactos sociales y ambientales; permite explorar un catálogo curado de estadísticas oficiales, filtrarlas y compararlas cuando sean compatibles, convertirlas en visualizaciones legibles e incorporarlas a reportes editables con referencias automáticas. Permite consultar por texto o voz y exportar un PDF profesional. Sin registro obligatorio en V1. Los autores mantienen el criterio editorial.

### 1.4 Antes y después

| Antes | Con el producto |
|---|---|
| Buscar el mismo dato en varios sitios. | Explorar diez áreas temáticas en un catálogo seleccionado. |
| Descifrar cobertura y unidad después de graficar. | Ver metadatos antes de aplicar filtros o comparar. |
| Copiar una gráfica a un procesador de texto. | Insertar un bloque de visualización directamente al reporte. |
| Construir bibliografía manualmente. | Tener referencias vinculadas a cada bloque de datos. |
| Perder el contexto entre pestañas. | Mantener una biblioteca de análisis dentro del espacio de edición. |
| Pegar afirmaciones sin distinguir el respaldo. | Separar claramente fuente de datos e interpretación del autor. |

## 2. Posicionamiento y límites

### 2.1 Qué es

- Un **espacio de trabajo para estudios con datos públicos oficiales**.
- Un **explorador guiado** de indicadores, no un buscador universal de internet.
- Un **laboratorio de visualización** con comparaciones metodológicamente controladas.
- Un **editor documental** con bloques de datos y referencias exportables.

### 2.2 Qué no es en V1

- No es una IA que escribe automáticamente reportes o conclusiones.
- No es una terminal de trading, herramienta de inversión o recomendador financiero.
- No ofrece datasets ilimitados, análisis estadístico avanzado ni cualquier consulta en lenguaje natural.
- No garantiza datos en cada municipio o periodo; la disponibilidad depende de la fuente.
- No es un sistema de colaboración, sincronización entre equipos ni almacenamiento en nube con cuentas.

### 2.3 Decisiones heredadas del SRS, no negociables en UX

Web responsive para escritorio y móvil; exactamente diez categorías activas en V1; al menos una consulta real verificada por categoría; uso de APIs oficiales aprobadas; edición sin cuenta obligatoria; voz con revisión y alternativa por texto; referencias trazables; reportes PDF; no interpretar datos ausentes como cero; bloquear o separar comparaciones incompatibles; preservar el borrador si falla una API.

## 3. Personas y trabajos por realizar

Las siguientes personas son **arquetipos de diseño**, no resultados de investigación de usuarios. Deben validarse con entrevistas antes de cerrar el diseño.

| Persona | Situación y motivación | Necesidad esencial | Riesgo UX |
|---|---|---|---|
| **Analista financiero (uso complementario)** | Prepara reportes económicos para clientes o directivos. | Series confiables, unidades, frecuencia, comparaciones y PDF profesional. | Perder tiempo, confundir niveles territoriales o versiones de cifras. |
| **Estudiante/investigador (público principal)** | Prepara una tarea, estudio o proyecto. | Encontrar indicadores entendibles y citarlos correctamente. | No comprender jerga estadística o asumir que no hay datos. |
| **Integrante de ONG o equipo social (público principal)** | Busca evidencia para justificar proyectos y presentaciones. | Indicadores sociales y ambientales con contexto claro. | Sacar conclusiones causales que la evidencia no sostiene. |

### Jobs to be done

- **Cuando** necesito fundamentar una afirmación con datos públicos, **quiero** encontrar un indicador confiable y comprender su alcance, **para** argumentar con seguridad.
- **Cuando** comparo territorios o periodos, **quiero** que el sistema me advierta sobre incompatibilidades, **para** no producir gráficos engañosos.
- **Cuando** preparo un informe, **quiero** insertar análisis sin perder la procedencia, **para** escribir más y administrar menos archivos.
- **Cuando** uso el celular o tengo ocupadas las manos, **quiero** poder dictar consultas o texto, **para** avanzar sin depender del teclado.

## 4. Principios de diseño

1. **La evidencia precede a la estética.** Ninguna gráfica atractiva compensa una fuente o unidad poco clara.
2. **Primero entender, después comparar.** El usuario reconoce definición, geografía, periodo y frecuencia antes de superponer series.
3. **Menos opciones, mejores decisiones.** Se ofrecen visualizaciones pertinentes y un catálogo validado, no un generador infinito de widgets.
4. **Continuidad de investigación.** Un análisis pasa del explorador al reporte con un solo flujo, sin perder filtros ni datos.
5. **El autor mantiene la voz.** La plataforma apoya la redacción, no cambia automáticamente argumentos o conclusiones.
6. **Accesibilidad real.** Gráficas con alternativa tabular, controles de teclado, contraste y mensajes comprensibles.
7. **Transparencia del estado.** «Actualizado por la fuente», «consultado hoy», «en caché» y «sin datos» significan cosas distintas.
8. **Mobile no es escritorio encogido.** En celular se prioriza leer, filtrar, consultar y editar lo esencial por pasos.
9. **Diseño institucional sin rigidez.** Serio, confiable y editorial; no frío, burocrático ni decorativo.
10. **Error recuperable.** Un problema de red o micrófono no hace perder trabajo ni elimina el acceso al editor.

## 5. Arquitectura de información

### 5.1 Navegación principal

**Inicio** / **Explorar datos** / **Mis reportes** / **Ayuda y fuentes**.

- **Inicio:** propuesta de valor, comenzar una investigación, continuar borrador local y accesos a categorías.
- **Explorar datos:** catálogo de diez categorías, búsqueda, ficha del indicador, filtros, gráfica o tabla, comparación y guardar análisis para insertar.
- **Mis reportes:** crear, abrir, renombrar, duplicar, eliminar y recuperar borradores guardados localmente.
- **Editor de reporte:** escritura, bloques de visualización, panel de datos guardados, referencias y exportación.
- **Ayuda y fuentes:** glosario, guías de compatibilidad, cobertura y licencias/atribución.

### 5.2 Agrupación temática sin cambiar las diez categorías

| Grupo de descubrimiento | Categorías del SRS |
|---|---|
| Economía y finanzas | CAT-01 Inflación; CAT-02 Actividad económica; CAT-03 Empleo; CAT-04 Ingresos y gasto; CAT-05 Tasas y tipo de cambio; CAT-06 Empresas. |
| Sociedad y territorio | CAT-07 Población; CAT-08 Vivienda; CAT-09 Educación. |
| Desarrollo sostenible | CAT-10 Medio ambiente. |

En navegación, las categorías siguen siendo diez entidades activas; los grupos son solo una ayuda visual. No se crearán nuevas categorías fuera de la línea base.

### 5.3 Arquitectura del trabajo activo

El usuario podrá moverse entre **Explorador** y **Editor** sin perder el indicador, comparación, borrador o posición de lectura. La relación primaria es: consulta validada → visualización → «Añadir al reporte» → bloque con metadatos → PDF con bibliografía.

## 6. Recorridos de usuario prioritarios

### Recorrido A — De una pregunta al primer PDF (camino feliz)

| Paso | Intención del usuario | Respuesta UX |
|---|---|---|
| 1 | Quiere estudiar empleo en Nuevo León. | Inicio ofrece «Explorar datos» y un ejemplo de pregunta. |
| 2 | Selecciona «Empleo y mercado laboral». | Catálogo muestra los indicadores habilitados, cobertura y fuente. |
| 3 | Elige desocupación. | Ficha explica indicador, unidad, frecuencia y notas relevantes. |
| 4 | Selecciona Nuevo León y un periodo permitido. | Filtros restringidos a opciones verificadas; consulta con estado de carga. |
| 5 | Observa los resultados. | Línea o tabla con fuente, periodo, unidad, alcance y datos ausentes. |
| 6 | Desea documentarlos. | «Añadir al reporte» propone crear uno o usar un borrador activo. |
| 7 | Redacta interpretación propia. | Editor ofrece título, párrafos y bloque de gráfica con procedencia preservada. |
| 8 | Comprueba bibliografía. | Panel «Fuentes» lista las referencias usadas, sin atribuir el texto propio a INEGI. |
| 9 | Previsualiza y exporta. | PDF refleja texto, gráfica y fuentes de una misma instantánea. |

**Momento de valor:** el usuario confirma que la gráfica quedó citada sin copiar archivos entre aplicaciones.

### Recorrido B — Consulta por voz

1. El usuario activa explícitamente el micrófono en **Explorar**.
2. La interfaz señala «Escuchando» y permite detener.
3. Reconoce «Compara desempleo de Nuevo León y Jalisco desde 2019» como texto preliminar.
4. Presenta campos interpretados (tema, territorios, periodo), con edición visible.
5. El usuario confirma la consulta; el sistema valida el indicador disponible, frecuencia y compatibilidad.
6. Ante ambigüedad, solicita elegir una opción; si el navegador no soporta voz, se mantiene entrada por teclado.

**Nunca** se ejecuta una comparación únicamente por haber escuchado una frase. El usuario revisa antes.

### Recorrido C — Comparación no válida

1. El usuario intenta combinar una serie anual nacional con una mensual estatal.
2. El sistema no las superpone como si tuvieran la misma unidad estadística.
3. Aparece un aviso: «Estas series no se pueden comparar directamente: difieren en frecuencia y cobertura».
4. Ofrece dos acciones válidas: **Ver por separado** y **Elegir otra serie**.
5. El trabajo existente y sus filtros no se eliminan.

### Recorrido D — Continuar un reporte

1. Inicio o «Mis reportes» presenta borradores guardados en el navegador actual.
2. Se muestra última modificación y estado de guardado.
3. El usuario abre un borrador y retoma el punto de edición.
4. Si el almacenamiento fue borrado o está en modo privado, se informa claramente la limitación; no se promete sincronización entre dispositivos.

## 7. Pantallas y anatomía

### P01. Inicio / onboarding ligero

**Objetivo:** que una persona sepa en menos de un vistazo qué puede hacer y cuál es el siguiente paso.

- Encabezado: navegación simple, identidad Prismo con isotipo aprobado y acceso a reportes.
- Hero editorial: «Convierte datos oficiales en reportes claros» con CTA principal **Explorar indicadores** y secundario **Crear reporte**.
- Tres pasos visuales: buscar → analizar → redactar.
- Diez categorías visibles por grupos, con ejemplos concretos de preguntas.
- Bloque discreto de «Continuar último reporte» cuando hay un borrador local.
- Sin carruseles promocionales, métricas inventadas, testimonios falsos ni chat flotante invasivo.

### P02. Catálogo y categoría

**Objetivo:** descubrir opciones reales sin abrumar.

- Búsqueda por nombre, tema o palabra clave dentro del catálogo validado.
- Filtros por organismo y temática, cuando aporten valor.
- Tarjetas de indicador con nombre oficial, explicación humana breve, geografía y frecuencia.
- Insignias textuales de disponibilidad solo si la información está comprobada.
- Mensaje «Esta categoría tiene [n] indicadores habilitados» sin insinuar cobertura universal.

### P03. Explorador de indicador

**Objetivo:** completar una consulta y entender su resultado.

- Breadcrumb de categoría → indicador.
- Encabezado con título del indicador y descripción breve.
- Zona de filtros: geografía, periodo, frecuencia y comparador cuando corresponda.
- Área principal: gráfica recomendada y control **Ver como tabla**.
- Ficha de confianza visible: organismo, identificador oficial, unidad, frecuencia, geografía, fecha consultada, fecha de actualización si existe y enlace a metodología.
- Acciones: **Añadir al reporte**, **Guardar análisis** (si se introduce como objeto reutilizable en el flujo previsto) y **Consultar otra serie**.

### P04. Comparador de series

**Objetivo:** facilitar comparaciones válidas sin esconder problemas.

- Selección de series o territorios con compatibilidad evaluada antes de dibujar.
- Estado de compatibilidad: **Comparables** o **No comparables directamente**, acompañado de explicación.
- Visualización conjunta solo si cumple las reglas de negocio.
- Controles para retirar una serie, ajustar periodo permitido o separarlas.
- Unidades, leyendas y etiquetas no dependientes exclusivamente del color.

### P05. Editor de reportes (pantalla central)

**Objetivo:** escribir sin perder acceso a la evidencia.

**Escritorio, estructura propuesta:**

| Panel izquierdo | Zona central | Panel derecho |
|---|---|---|
| Índice del documento, navegación de secciones. | Página o lienzo de escritura, barras de formato, texto y bloques estadísticos. | Biblioteca de análisis, ficha de fuentes y avisos metodológicos del bloque seleccionado. |

La zona central prioriza la lectura y edición. Los paneles laterales son colapsables para no consumir ancho al escribir.

- Barra superior: título del reporte, estado de guardado, vista previa y **Exportar PDF**.
- Bloques principales: párrafo, encabezado, lista, tabla editable, gráfica insertada y referencias.
- Menú contextual de bloque: mover, duplicar y eliminar con confirmaciones cuando se requieran.
- Dictado en el editor: **Insertar texto**, nunca consultar automáticamente estadísticas.
- La bibliografía se alimenta de bloques de datos insertados; las afirmaciones libres permanecen responsabilidad del autor.

### P06. Mis reportes

**Objetivo:** permitir volver al trabajo sin cuentas.

- Tarjetas o lista con título, última modificación y estado local.
- Acciones: abrir, renombrar, duplicar, eliminar (confirmación).
- Información permanente: «Los reportes se guardan en este navegador. No se sincronizan automáticamente con otros dispositivos».
- Estado vacío con CTA «Crear primer reporte» y un ejemplo de uso.

### P07. Vista previa / exportación

**Objetivo:** dar confianza antes de generar un documento profesional.

- Vista de portada, saltos de página, encabezados, tablas, gráficas y bibliografía.
- Datos de portada: título, autor opcional, fecha.
- Advertencias concretas si hay elementos que no podrán exportarse correctamente.
- CTA final **Exportar PDF** y posibilidad de volver al editor sin perder cambios.
- La salida conserva una instantánea del dato, incluso si la fuente se actualiza después.

### P08. Ayuda y fuentes

**Objetivo:** aclarar términos estadísticos y procedencia sin crear barreras.

- Glosario: indicador, serie, frecuencia, cobertura, dato ausente, preliminar y actualización.
- Explicación visual de diferencias entre datos nacionales, estatales y municipales.
- Enlaces oficiales y avisos de licencias/atribución.
- Accesos contextuales en las gráficas hacia el elemento relevante de ayuda.

## 8. Sistema de visualización y storytelling de datos

### 8.1 Jerarquía de una gráfica

1. **Pregunta que responde**, redactada con lenguaje claro.
2. **Título estadístico** fiel al indicador oficial.
3. **Subtítulo contextual**: geografía, unidad y periodo.
4. **Gráfica o tabla** del dato observado.
5. **Notas de interpretación metodológica** y estados especiales.
6. **Fuente y fechas**: origen, identificador, consulta y actualización disponible.
7. **Acción** para insertar al reporte.

### 8.2 Elección de gráfica

| Pregunta | Forma preferida | Alternativa accesible |
|---|---|---|
| Evolución temporal | Línea con intervalos y huecos explícitos | Tabla por periodo |
| Comparación de territorios | Barras horizontales o verticales | Tabla ordenable/legible |
| Valor de un indicador | Tarjeta numérica con unidad y contexto | Texto estructurado |
| Consulta detallada de valores | Tabla desde el inicio | Exportación tabular en evolución futura |
| Distribución espacial | Mapa solo si cobertura geográfica lo justifica | Lista/tabla de regiones |

Una gráfica no se diseña solo porque sea vistosa. La selección debe derivarse de la pregunta estadística; no usar pastel para series temporales ni doble eje para ocultar escalas incompatibles. Nunca interpolar valores ausentes sin indicarlo.

### 8.3 Diseño accesible de charts

No depender solo del color; añadir leyendas textuales, patrones discriminables solo cuando ayudan y etiquetas. Ofrecer tabla de valores y descripción del propósito. Soportar foco de teclado cuando existan controles interactivos. Preservar unidades y fuentes en exportación. Diseñar tanto para pantalla como para PDF.

## 9. Identidad de marca y sistema visual de Prismo

### 9.1 Decisión de marca y propósito

- **Nombre del producto:** **Prismo**.
- **Nombre del recurso gráfico:** `PrismoLogo`; en este paquete se acompaña como `PrismoLogo.png`.
- **Tipología:** isotipo independiente, **sin nombre escrito dentro**. El producto puede mostrar la palabra **Prismo** como texto de interfaz a su lado cuando convenga (por ejemplo, en la navegación), pero no se modifica la imagen del isotipo para agregar texto.
- **Personalidad acordada:** elegante, moderna, profesional, sobria y accesible.
- **Territorio de marca:** investigación guiada, análisis responsable y documentos sustentados con evidencia oficial.
- **Slogan editorial de trabajo:** «Del dato al reporte, con evidencia». Es una propuesta de microcopy, no un texto obligatorio integrado al logo.
- **Posicionamiento:** una herramienta de investigación y reportes; **no** una plataforma que asegura que cualquier afirmación del usuario es verdadera.

El nombre **Prismo** evoca distintas perspectivas sobre la información: seleccionar una fuente, visualizar un fenómeno, contrastar sus límites y construir un documento. Es una asociación conceptual de marca; no constituye una etimología ni un sello de verificación.

> **Alcance actual:** el nombre **Prismo** y el isotipo `PrismoLogo.png` se usarán para el prototipo. Se pospone cualquier discusión de dominio o verificación comercial/legal por decisión del responsable del producto.

### 9.2 Isotipo aprobado

![Isotipo aprobado de Prismo, recurso de referencia](./PrismoLogo.png)

**Descripción conceptual del isotipo:** símbolo abstracto de búsqueda y análisis: forma circular vinculada a una lupa, barras ascendentes y señales de tendencia. Sintetiza **exploración + visualización de datos**. Esta descripción orienta el diseño, pero el archivo gráfico aprobado sigue siendo la fuente visual de referencia.

**Reglas de uso:**

1. Mantener el isotipo **sin texto**, centrado y con proporciones originales.
2. Usar la versión aprobada; **no volver a generar un logo distinto**, agregar documentos, cerebros, destellos, sombras 3D o adornos sin revisión del responsable del proyecto.
3. Para la barra de navegación, colocarlo junto al nombre **Prismo** como texto de interfaz independiente, con separación suficiente.
4. Para favicon o avatar, priorizar una variante simplificada y contrastada derivada del isotipo (por diseñar, no asumida como entregada).
5. Usar un recurso de imagen con transparencia real; si el archivo maestro tiene zonas translúcidas o brillos, revisar su lectura tanto sobre marfil como sobre superficies oscuras. No simular transparencia pintando un fondo marfil dentro del archivo.
6. Mantener un área de protección mínima alrededor del símbolo equivalente, de manera provisional, al **25 % de su lado visible**; ajustar en el manual final después de validar el recorte vectorial.
7. No estirar, rotar, aplicar contornos automáticos, poner dentro de una gráfica como marca de agua, ni usar el isotipo como indicador de que los datos fueron «certificados».

**Aplicaciones prioritarias:** favicon (en variante validada), menú principal, pantalla de inicio, portada de PDF y panel de «Mis reportes». En el cuerpo del PDF debe conservarse sobrio y secundario frente al contenido académico.

### 9.3 Paleta oficial

La identidad utiliza **seis colores definidos**; sus valores hexadecimales no deben alterarse arbitrariamente en el sistema de diseño:

| Token conceptual | Color | HEX | Uso principal |
|---|---|---|---|
| `brand.ivory` | Marfil | `#F6F1E8` | Fondo de aplicación y superficies de lectura amplias. |
| `brand.beige` | Beige | `#E4D7C6` | Secciones secundarias, divisores suaves y superficies auxiliares. |
| `brand.lightBrown` | Café claro | `#A78467` | Elementos gráficos secundarios, líneas decorativas moderadas y datos destacados con apoyo textual. |
| `brand.darkBrown` | Café oscuro | `#5C4635` | CTA primario, encabezados acentuados, íconos y elementos clave. |
| `brand.olive` | Olivo profundo | `#68745B` | Acentos, selección, detalles de datos y categorías; no usar como única señal de éxito. |
| `brand.ink` | Texto oscuro | `#2A241F` | Texto principal, títulos, números, tablas y etiquetas. |

**Distribución visual propuesta, no regla rígida:** predominio de marfil y superficies claras; café oscuro para jerarquía y acciones importantes; olivo para selección y acentos; café claro y beige para soporte. No convertir cada categoría del catálogo en un color de marca distinto.

#### Legibilidad y contraste

- El texto `#2A241F` sobre marfil alcanza aproximadamente **13.6:1**; es una combinación principal segura para contenido habitual.
- El café oscuro `#5C4635` sobre marfil alcanza aproximadamente **7.8:1**; resulta adecuado para botones o encabezados.
- El olivo `#68745B` sobre marfil alcanza aproximadamente **4.4:1**, **ligeramente menor** al umbral WCAG AA de 4.5:1 para texto pequeño: por eso se reservará para acentos, líneas, elementos grandes o controles cuya combinación se compruebe. Sobre blanco alcanza aproximadamente 5:1.
- El café claro `#A78467` sobre marfil alcanza aproximadamente **3.0:1**, insuficiente para texto de tamaño normal. No usarlo para párrafos, cifras pequeñas o enlaces sin tratamiento adicional.
- Los controles, íconos funcionales, estados de foco y series gráficas deben evaluarse con las reglas de contraste pertinentes de WCAG 2.2, **no solo con la estética de la paleta**.

Los valores anteriores son cálculos aproximados para los colores puros; la opacidad, las capas y los estados hover pueden reducir el contraste y deben reevaluarse.

### 9.4 Roles semánticos sugeridos

La UI debe separar **colores de marca** y **colores de estado**. Los seis colores no sustituyen automáticamente una paleta accesible de errores/advertencias. La eventual incorporación de tonos de error y éxito se justificará por contraste y significado, no por decoración.

| Rol | Tratamiento inicial |
|---|---|
| Fondo de la web | Marfil `#F6F1E8`. |
| Superficie editorial | Marfil o superficie neutra muy clara; contrastar por borde/espaciado. |
| Texto principal | Tinta oscura `#2A241F`. |
| Acción principal | Fondo café oscuro `#5C4635` + etiqueta clara de contraste verificado. |
| Acción secundaria | Superficie clara, borde café oscuro y texto tinta. |
| Selección y detalle | Olivo `#68745B` con indicador adicional de forma, texto o borde. |
| Divisiones y fondo auxiliar | Beige `#E4D7C6`, sin depender del color como único delimitador. |
| Métricas y series de charts | Combinación controlada de café/olivo; etiquetas, símbolos y trazos diferenciables. |
| Errores de API o dato ausente | Mensaje explícito, icono y alternativa; no asignar rojo/olivo sin sistema semántico validado. |

### 9.5 Tipografía y tono editorial

**Dirección tipográfica:** sans serif contemporánea, refinada y de alta legibilidad, con números tabulares para series económicas. La fuente exacta permanece abierta hasta la selección del sistema de diseño; no corresponde decidir una librería tipográfica en este documento.

- Títulos breves, con jerarquía clara y sin exceso de peso.
- Texto de informes cómodo para lectura extensa; evitar tipografías display en tablas.
- Uso moderado de versales; textos funcionales en español natural.
- La interfaz debe distinguir **dato**, **metadato**, **interpretación del autor** y **advertencia metodológica** por título, posición y estilo, nunca solo por color.
- Lenguaje: preciso, amable, directo y verificable. Ejemplos: «Explorar indicadores», «Comparar», «Añadir al reporte», «Revisar fuente», «Exportar PDF».
- Evitar: «La IA descubrió», «Tendencia garantizada», «100 % confiable», «Verdad absoluta» y cualquier atribución no sustentada.

### 9.6 Geometría, iconos y movimiento

- **Diseño:** minimalismo editorial con retículas claras, márgenes generosos y contenido denso solo donde la tabla lo requiera.
- **Tarjetas:** radios suaves y bordes finos; sin sombras excesivas ni efecto de cristal.
- **Gráficas:** líneas y barras claras, sin 3D ni degradados volumétricos; la elegancia proviene de proporción, etiquetas y datos.
- **Iconografía:** simple, con trazo visual homogéneo; acompañar con texto las acciones críticas.
- **Movimiento:** corto y funcional para revelar estados, cargar consultas y abrir paneles; respetar preferencia por movimiento reducido.
- **Fotografía/ilustración:** no será la protagonista de una pantalla analítica. Priorizar los datos y la escritura.
- **Evitar estética «generada por IA»:** brillo plástico, círculos de neón, símbolos genéricos de cerebro, grillas futuristas de fondo y componentes decorativos sin función.

### 9.7 Aplicación en pantallas principales

**Inicio:** isotipo + nombre Prismo; hero editorial con encabezado sobrio y CTA café oscuro. Los ejemplos de investigación van primero; las categorías se presentan con estructura consistente.

**Catálogo:** fondos claros, filtros discretos, tipografía oscura y acento olivo únicamente donde indique selección real. Las diez categorías conservan su jerarquía semántica.

**Explorador y comparador:** máxima claridad para gráficas. No usar la paleta decorativamente en todas las series; en comparaciones con más de dos grupos se requerirán tonos o patrones adicionales accesibles, documentados aparte.

**Editor de reportes:** aspecto de hoja profesional y limpio. La barra de herramientas es discreta; paneles en beige o marfil; botones de exportación en café oscuro. El editor no debe parecer un chat.

**Vista móvil:** marca compacta, menú legible, una tarea principal por vista, gráficos utilizables sin zoom y acciones siempre acompañadas de texto accesible.

**PDF:** conservar marca en portada con prudencia; el gráfico, su título, unidad y referencia son siempre prioritarios. Evitar fondos crema que consuman tinta en todas las páginas: el estilo de la web puede traducirse a un PDF mayormente claro sin perder identidad.

### 9.8 Design tokens de referencia (conceptuales, sin elegir tecnología)

```text
Prismo / tokens semánticos para fase de diseño
brand.ivory        = #F6F1E8
brand.beige        = #E4D7C6
brand.lightBrown   = #A78467
brand.darkBrown    = #5C4635
brand.olive        = #68745B
brand.ink          = #2A241F

surface.canvas     -> brand.ivory
surface.subtle     -> brand.beige
text.primary       -> brand.ink
action.primary     -> brand.darkBrown
accent.selected    -> brand.olive (verificar contraste por contexto)
```

La siguiente etapa de design system convertirá estos conceptos en tokens de estados, tipografía, espaciado y componentes. **No constituyen todavía variables CSS definitivas ni una selección de stack.**

### 9.9 Lista de aceptación de identidad

- [ ] El producto se presenta como **Prismo** y el archivo de marca se identifica como **PrismoLogo**.
- [ ] El isotipo se conserva **sin texto incrustado**, con proporciones correctas.
- [ ] Los seis colores oficiales están documentados con sus HEX exactos.
- [ ] Los textos y controles superan contraste mínimo para su función; olivo/café claro no se aplican de forma ilegible.
- [ ] Una gráfica siempre tiene fuente, periodo, unidad y alternativa tabular.
- [ ] El editor y el PDF conservan un estilo editorial profesional, no decorativo.
- [ ] No hay componentes con estética 3D, futurista o de «IA genérica» sin propósito.
- [ ] El logo se prueba en tamaños reales de barra superior y favicon antes de su uso final.


## 10. Diseño de la entrada por voz

**Modo 1 — Consulta de datos:** disponible en el explorador. El usuario puede decir «Muestra la inflación de México desde 2020». Resultado: transcripción editable y campos de consulta interpretados; confirmación antes de ejecutar.

**Modo 2 — Comparación:** una consulta con dos territorios compatibles, como «Compara el desempleo de Nuevo León y Jalisco». El sistema pide aclaraciones cuando hay varios indicadores plausibles.

**Modo 3 — Dictado editorial:** disponible en el editor. Transcribe texto para su inserción; no interpreta ni ejecuta consultas estadísticas ni cambia referencias.

| Estado | Mensaje UI sugerido | Acción |
|---|---|---|
| Inactivo | «Consultar por voz» / «Dictar texto» | Iniciar explícitamente |
| Solicitando permiso | «Permite el micrófono para usar esta función» | Continuar o usar texto |
| Escuchando | «Escuchando…» | Detener |
| Transcripción | «Revisa tu consulta antes de continuar» | Editar / Confirmar / Descartar |
| Ambigüedad | «Encontré más de un indicador posible» | Elegir opción |
| Error o no compatible | «La voz no está disponible aquí. Puedes escribir tu consulta» | Campo de texto visible |

Mostrar privacidad en contexto: puede haber proveedores externos de reconocimiento de voz; no prometer ejecución local u offline hasta comprobarlo. Si se procesa audio fuera del dispositivo, informar antes de activar.

## 11. Estados, recuperación y microcopy

| Estado | Microcopy propuesto | Comportamiento correcto |
|---|---|---|
| Sin observaciones | «No hay datos publicados para los filtros seleccionados» | Mostrar opciones de periodo/territorio válidas; nunca graficar cero inventado. |
| Datos históricos en caché | «Mostrando una consulta guardada del [fecha]» | Diferenciarla de una consulta nueva. |
| Falta compatibilidad | «Estas series no se pueden comparar directamente» | Explicar razón, ofrecer gráfico separado. |
| API no responde | «No pudimos consultar esta fuente. Tu reporte sigue disponible» | Reintentar; preservar editor. |
| Borrador guardado | «Guardado en este navegador» | Mostrar estado verdadero, no simulación. |
| Guardado fallido | «No se pudieron guardar los últimos cambios» | Mantener contenido visible y ofrecer recuperación. |
| Micrófono no disponible | «Puedes escribir la consulta en su lugar» | Entrada manual equivalente. |
| Exportación incompleta | «Una gráfica no pudo incluirse correctamente» | No marcar el PDF como completo. |

**Regla editorial:** los mensajes nunca culpan al usuario cuando faltan datos por cobertura oficial. El tono evita falsa certeza: «No encontramos una serie válida» en lugar de «No existe ese dato en México».

## 12. Responsividad: escritorio y celular

### Escritorio

Vista de tres zonas en el editor solo si el ancho lo permite: índice, documento y biblioteca/fuentes. Explorador con filtros agrupados y gráfico principal. Acciones de contexto cercanas al contenido y atajos de teclado documentados.

### Celular

Navegación por vistas y paneles desplegables. En el explorador: filtros en flujo vertical o cajón, gráfica que cabe en el ancho y tabla con desplazamiento **interno** señalizado. En el editor: prioridad al contenido y barra de formato compacta; biblioteca de análisis y fuentes en panel emergente; exportación accesible en menú de documento. Evitar scroll horizontal global a 360 px. No convertir editor móvil en tres columnas diminutas.

**Anchos de evaluación heredados del SRS:** 360 px, 768 px y 1280 px. La voz debe ser opcional; todas las funciones básicas se completan con teclado o pantalla táctil.

## 13. Accesibilidad y comprensión estadística

- Objetivo de WCAG 2.2 AA en flujos críticos: foco visible, etiquetas, contraste, estados comunicados y teclado.
- Evitar controles distinguibles únicamente por color, ubicación o iconografía.
- Cada gráfica debe ofrecer tabla o descripción equivalente de los datos.
- Formularios deben indicar claramente qué campo está incompleto o no es válido.
- No usar animación para presentar información que no pueda obtenerse de otra forma.
- Explicar en lenguaje cotidiano diferencias entre nacional/estatal/municipal, serie censal vs mensual y dato preliminar vs definitivo.
- Los criterios metodológicos son parte del producto, no notas escondidas en un pie ilegible.

Referencias de buenas prácticas a consultar en fase de diseño detallado:

- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
- GOV.UK, principios de visualización de datos: https://brand.design-system.service.gov.uk/data/
- UK Department for Education, accesibilidad en gráficas: https://design.education.gov.uk/design-system/patterns/charts

## 14. Storytelling dentro de cada reporte

Los reportes no deben ser una acumulación de gráficas; deben ayudar a construir una narración documentada. La plataforma ofrecería una estructura editable de referencia, no una conclusión escrita automáticamente:

1. **Portada:** título, autor opcional, fecha.
2. **Propósito:** pregunta de investigación y alcance.
3. **Contexto:** definiciones, periodo y territorio.
4. **Evidencia:** gráficos, tablas y observaciones.
5. **Interpretación del autor:** texto libre, separado de los datos publicados.
6. **Limitaciones:** cobertura, faltantes, cambios de metodología.
7. **Conclusiones del autor:** sin autocompletado sustantivo en V1.
8. **Referencias:** organismos, indicadores, fechas y enlaces oficiales usados.

**Inserción inteligente sin IA generativa:** cuando se agrega una gráfica se incorporan sus metadatos y el pie de figura, pero no se escribe «Esto demuestra que…». Si el usuario necesita interpretar, la interfaz puede ofrecer preguntas de reflexión, por ejemplo «¿Qué cambio observas en el periodo?» sin responderlas.

## 15. Estrategia de validación UX

### Hipótesis que debemos contrastar

- H1: una persona puede completar el circuito indicador → gráfica → reporte → PDF sin cambiar de aplicación.
- H2: la referencia automática reduce errores de atribución respecto a un proceso manual.
- H3: la explicación visible de incompatibilidad evita que el usuario publique una comparación engañosa.
- H4: separar el modo voz de consulta y dictado evita ejecuciones accidentales.
- H5: un catálogo limitado pero validado genera más confianza que prometer todas las estadísticas de la web.

### Prueba moderada inicial

**Participantes:** 10 usuarios representativos (mezcla de estudiantes e investigadores/analistas; reclutamiento por conveniencia, sin generalización estadística).  
**Tarea central:** elegir un indicador, aplicar filtros, insertar gráfica, escribir dos párrafos, verificar fuente y exportar PDF.  
**Métricas:** tasa de finalización sin asistencia (objetivo SRS ≥8/10); errores de selección; comprensión de fuente y unidad; tiempo por tarea; puntos de abandono; aceptación de comparaciones inválidas (objetivo: cero); claridad de la voz.  
**Instrumentos:** guion, registro de pasos, cuestionario breve de claridad/confianza y comprobación visual del PDF.

### Ronda de pruebas por entregable

| Hito | Qué validar | Evidencia |
|---|---|---|
| Wireframes de baja fidelidad | Arquitectura de información y comprensión de CTA. | Prueba de primera impresión y árbol de navegación. |
| Prototipo de exploración | Filtros, gráficas, metadatos y comparaciones. | Tareas con casos válidos/inválidos. |
| Prototipo de editor | Inserción, bibliografía, guardado y exportación. | Flujo completo y PDF revisado. |
| Web responsive | Accesibilidad por teclado, móvil y fallos. | Checklist WCAG y matriz de escenarios. |

## 16. Secuencia de diseño y desarrollo por verticales

Esto no redefine el alcance V1 del SRS; define un orden para construirlo sin dispersión.

| Entrega | Resultado verificable | Alcance de experiencia |
|---|---|---|
| **Vertical 0 — prueba del concepto** | Una consulta de una fuente oficial produce una gráfica trazable, se inserta en un reporte y se exporta a PDF. | Una categoría, una serie; sin pulir todo el catálogo. |
| **Vertical 1 — núcleo del producto** | Explorador, comparación, editor, borradores y voz funcionan con dos categorías de fuentes distintas. | Validar interacciones y reglas de compatibilidad. |
| **V1 completa** | Diez categorías con al menos una consulta verificada por categoría, PDF, accesibilidad y estados robustos. | Cobertura funcional completa del SRS aprobado. |

## 17. Contrato UX para futuras skills de Codex

En la siguiente fase, las instrucciones para agentes/codificación deberán mantener invariantes explícitos:

- **No inventar datos, indicadores, fuentes, años ni coberturas.**
- **No mezclar series incompatibles en una sola gráfica sin validación metodológica.**
- **No ocultar fuentes, unidades, periodos o estados de disponibilidad.**
- **No convertir voz en una acción irreversible sin revisión y confirmación.**
- **No generar conclusiones sustantivas por IA en V1.**
- **No solicitar registro para crear, guardar localmente y exportar un reporte.**
- **No bloquear el editor porque la API de datos falle.**
- **No suponer que un borrador local se sincroniza con otros dispositivos.**
- **No entregar PDF silenciosamente incompleto o sin trazabilidad.**
- **No redefinir la arquitectura o stack aquí: esas elecciones corresponden a la fase posterior.**

Los futuros archivos de contexto deberían separar: visión del producto, lineamientos UX, componentes/pantallas, reglas de datos, contratos de voz, calidad y pruebas, y finalmente arquitectura/stack.

## 18. Decisiones abiertas para la siguiente fase

| ID | Decisión pendiente | Qué necesitamos definir |
|---|---|---|
| UX-DA-01 | Nombre e identidad comercial | **Resuelto para prototipo:** Prismo; isotipo `PrismoLogo`. **Fuera de esta fase:** dominio y disponibilidad legal; las variantes de producción se revisarán tras el prototipo. |
| UX-DA-02 | Lenguaje visual definitivo | **Resuelto:** paleta de seis HEX, dirección elegante y moderna, uso del isotipo. **Pendiente:** fuente exacta, escala tipográfica, espaciado, biblioteca de componentes y tokens funcionales. |
| UX-DA-03 | Editor | Interacciones de bloques, modelo documental y previsualización sin elegir aún herramienta. |
| UX-DA-04 | Fuente de verdad de datos | IDs exactos, definiciones y cobertura de 1–3 indicadores por categoría. |
| UX-DA-05 | Guardado | Comportamiento preciso de autosave/manual, errores y recuperación. |
| UX-DA-06 | Voz | Reconocimiento compatible por navegador, consentimiento, estados y vocabulario validado. |
| UX-DA-07 | PDF | Formato de papel, pie de gráfica, paginación y referencias. |
| UX-DA-08 | Stack y system design | Elección posterior alineada con SRS y experiencia validada. |

## 19. Lista de revisión de diseño antes de pasar a arquitectura

- [x] Se definió nombre de marca **Prismo** e isotipo **PrismoLogo**.
- [x] Se aprobó la paleta marfil, beige, café claro, café oscuro, olivo y tinta oscura.
- [x] Dominio y disponibilidad legal se excluyeron expresamente de esta fase.
- [ ] El producto se puede explicar en una frase sin mencionar frameworks.
- [ ] Cada pantalla tiene objetivo, acción principal y estado vacío/error definidos.
- [ ] El trayecto consulta → gráfica → reporte → PDF funciona en un prototipo de interacción.
- [ ] Los datos nunca aparecen sin unidad, fuente y periodo.
- [ ] Comparaciones inválidas muestran una alternativa útil, no un bloqueo sin salida.
- [ ] La voz siempre permite editar y cancelar; dictado editorial no dispara consultas.
- [ ] Los reportes locales comunican límites de persistencia.
- [ ] Las diez categorías corresponden exactamente al SRS-DATOS-001.
- [ ] El móvil no reproduce miniaturizada la distribución de escritorio.
- [ ] Las reglas de WCAG 2.2 AA se consideran desde los wireframes.
- [ ] El PDF conserva contexto, referencias y legibilidad.
- [ ] Están identificadas las decisiones todavía abiertas, sin confundir propuestas UX con requisitos aprobados.

---

**Estado del documento:** blueprint UX v1.2 actualizado con la definición de producto centrada en informes sobre cambios e impactos sociales y ambientales, identidad **Prismo** y paleta aprobada. Conserva los requisitos del SRS-DATOS-001 v1.0 como referencia; la arquitectura y el stack viven en documentos separados del paquete Codex. La validación visual detallada continuará durante el prototipo funcional.


## Anexo A — Relación con arquitectura y stack

Este blueprint define **qué experiencia entregar**; `PRISMO_SYSTEM_DESIGN_v1.0.md` define **cómo se separan responsabilidades** y `PRISMO_TECH_STACK_v1.0.md` propone **con qué implementarlas**. En caso de conflicto: requisitos verificables del SRS prevalecen en funcionalidades, decisiones de producto explícitas más recientes prevalecen en público y posicionamiento; las dependencias de un proveedor nunca justifican inventar datos.
