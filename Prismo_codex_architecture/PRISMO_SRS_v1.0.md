# SRS Prismo — transcripción de referencia de SRS-DATOS-001 v1.0

> Documento original: `SRS_Plataforma_Web_Datos_Oficiales_v1.0.docx` (11/11/2026). Referencia textual para Codex; **no sustituye al SRS original**. La definición de público meta adoptada el 12/11/2026 está en `PRISMO_PRODUCT_UX_v1.2.md` y es la actualización aprobada.

SRS  /  REQUISITOS DE SOFTWARE

Plataforma web de investigación y reportes con datos oficiales

Especificación de Requisitos de Software · Nombre comercial por definir

Enfoque A  —  Investigación asistida, reportes verificables y control del usuario

Versión 1.0  |  Estado: línea base propuesta para revisión  |  11 de noviembre de 2026

Preparado para: definición de producto, análisis, arquitectura y posterior desarrollo individual

NOTA DE CONFORMIDAD

Documento original estructurado con base en las prácticas y contenidos de ISO/IEC/IEEE 29148:2018. No reproduce el texto protegido de la norma ni constituye certificación formal de cumplimiento. Los requisitos y cifras de desempeño son propuestas verificables pendientes de validación en pruebas.

Principio rector: ninguna visualización o conclusión debe sugerir que existen datos, comparabilidad o certeza que la fuente no respalda.

Control del documento

| Atributo | Valor |
| --- | --- |
| Título | Especificación de Requisitos de Software de la plataforma web de datos oficiales |
| Identificador | SRS-DATOS-001 |
| Versión | 1.0 |
| Fecha | 11/11/2026 |
| Nombre comercial | Pendiente; no se adopta “ImpactLens” como nombre definitivo |
| Estado | Propuesta de línea base para validación |
| Modelo de producto | Enfoque A: investigación asistida; no generación automática de interpretaciones |
| Destinatarios | Responsable de producto/desarrollo, diseñador UX, testers, colaboradores futuros |
| Alcance temporal | Primera versión funcional (V1) + evolución posterior diferenciada |

Historial de cambios

| Versión | Fecha | Descripción |
| --- | --- | --- |
| 1.0 | 11/11/2026 | Consolidación inicial del problema, alcance, diez categorías, requisitos, historias, casos de uso, reglas y criterios de aceptación. |

Convenciones

RF = requisito funcional; RNF = requisito no funcional; RB = regla de negocio/datos; HU = historia de usuario; CU = caso de uso; CA = criterio de aceptación.

Must = obligatorio para declarar V1 lista; Should = deseable, puede posponerse por prioridad; Could = mejora opcional.

Los requisitos se expresan de forma que permitan pruebas de verificación; los objetivos cuantitativos son iniciales y se revisarán con evidencia.

Índice de secciones

• 1. Introducción, problema y objetivos

• 2. Visión del sistema, alcance y entorno

• 3. Usuarios, necesidades y escenarios

• 4. Diez categorías y fuentes de datos

• 5. Casos de uso e historias de usuario

• 6. Requisitos funcionales

• 7. Requisitos no funcionales e interfaces

• 8. Reglas de negocio y modelo conceptual

• 9. Validación, aceptación y trazabilidad

• 10. Riesgos, supuestos y decisiones pendientes

• 11. Roadmap, glosario y referencias

### 1. Introducción, problema y objetivos

### 1.1 Propósito

Especificar de manera consistente, trazable y verificable las necesidades y requisitos para una aplicación web que facilite investigar datos oficiales, generar comparaciones y construir reportes con texto, gráficos, tablas y referencias exportables a PDF. El documento sirve como contrato de alcance de producto previo a arquitectura, diseño detallado y elección de tecnologías.

### 1.2 Necesidad y problema

Analistas, estudiantes, investigadores y organizaciones requieren preparar estudios basados en estadísticas oficiales. Hoy la búsqueda, comprensión de metadatos, descarga, transformación, visualización, redacción y citación están dispersas entre diversos portales y herramientas. Esto consume tiempo, eleva la carga cognitiva y favorece errores de transcripción, comparaciones inválidas, gráficas sin contexto o informes con referencias incompletas.

### 1.3 Propuesta de valor

La plataforma integra exploración guiada de indicadores oficiales, filtros pertinentes, visualizaciones prediseñadas, consultas por texto o voz, y un editor de reportes. El analista mantiene el control de la selección de datos, interpretaciones y redacción; el sistema conserva la procedencia y las limitaciones de cada indicador.

### 1.4 Objetivos de negocio/producto

OBJ-01  Reducir los pasos manuales necesarios para pasar de una pregunta de investigación a un reporte referenciado.

OBJ-02  Facilitar acceso contextualizado a diez categorías de indicadores de interés económico, financiero, social y ambiental.

OBJ-03  Permitir que usuarios no programadores seleccionen y comparen indicadores sin escribir consultas API.

OBJ-04  Preservar trazabilidad de los datos utilizados en cada gráfica, tabla y reporte.

OBJ-05  Ofrecer experiencia web responsiva con entrada por voz opcional y equivalente por texto.

OBJ-06  Habilitar producción de un PDF profesional sin salir del flujo de análisis.

### 1.5 Indicadores de éxito propuestos

| Métrica | Umbral inicial de aceptación/validación |
| --- | --- |
| Finalización del flujo | Al menos 8 de 10 participantes en prueba guiada crean un reporte con una gráfica y PDF sin ayuda del facilitador. |
| Trazabilidad | 100% de los bloques de datos exportados incluyen identificador de fuente y fecha de consulta. |
| Cobertura funcional | 10 categorías visibles, cada una con al menos 1 consulta/visualización verificada en V1. |
| Integridad | 0 comparaciones silenciosas entre unidades o períodos incompatibles en pruebas definidas. |
| Accesibilidad | Objetivo de conformidad con WCAG 2.2 AA en flujos críticos, verificada en auditoría. |

### 1.6 Fuera de alcance

Generación de conclusiones sustantivas, predicciones económicas o recomendaciones financieras automáticas por IA.

Asistente conversacional ilimitado que entienda cualquier pregunta de cualquier base de datos.

Sistema de autoría equivalente a Microsoft Word en todas sus capacidades (macros, colaboración compleja, etc.).

Edición simultánea y en tiempo real de reportes por múltiples personas.

Importación y preparación arbitraria de ficheros personales; APIs privadas o de pago no aprobadas.

Garantía de que todos los indicadores existen a escala municipal, estatal y nacional.

Generación automática de citas respaldando opiniones del usuario sin vinculación explícita.

Servicio de asesoría de inversión, certificación oficial de datos o dictámenes profesionales.

### 2. Visión, alcance y contexto operativo

### 2.1 Producto y límite del sistema

El sistema es una página/aplicación web accesible por navegador en computadora y celular. Su frontera incluye catálogo de categorías/indicadores, orquestación de consultas a fuentes públicas, transformación de respuestas, visualizaciones, biblioteca temporal de análisis, edición de reportes, persistencia de borradores, citas y exportación. Fuera de la frontera quedan las bases estadísticas originales, sus metodologías y la infraestructura de los organismos que las publican.

### 2.2 Entorno de uso

Uso primario en navegador de escritorio o laptop para construir reportes extensos.

Uso secundario en navegador móvil para consultar indicadores, crear gráficos, dictar texto y editar reportes con interfaz adaptativa.

Conexión a internet para obtener o actualizar datos de APIs externas. Un borrador ya guardado podrá consultarse según la estrategia de persistencia adoptada.

Experiencia principal en español; fechas, separadores y unidades claramente expresados para México.

### 2.3 Restricciones establecidas

Debe ser web responsive, no una aplicación nativa de iOS/Android.

Debe consumir APIs y/o recursos oficiales públicos aprobados, respetando autenticación, licencia y límites.

Debe permitir creación de PDF; el formato interno del editor no se especifica aún.

Debe incluir uso de reconocimiento de voz como capacidad de entrada opcional; no podrá bloquear las tareas básicas por falta de micrófono.

El presupuesto del prototipo es prácticamente nulo; una eventual demo no debería depender de licencias costosas.

No se seleccionan todavía framework, hosting, base de datos, librerías ni proveedor de voz.

### 2.4 Supuestos y dependencias

SUP-01 Las APIs seleccionadas continuarán disponibles y sus términos admitirán los usos previstos. SUP-02 La cobertura real de cada indicador será auditada antes de declarar completa una categoría. SUP-03 La edición de reportes se realizará inicialmente por una persona en un navegador/dispositivo; no se requiere sincronización en V1. SUP-04 El usuario acepta que voz/cámara/permisos dependen de navegador y dispositivo. SUP-05 Los reportes son documentos del usuario y sus conclusiones son responsabilidad de quien las redacta.

### 2.5 Restricciones de negocio frente a decisiones de diseño

Este documento fija el QUÉ y los criterios de calidad, no el CÓMO. La decisión sobre almacenamiento local o remoto, tecnologías de transcripción, representación de documentos, adaptadores de fuentes y generación de PDF será materia de diseño de software, siempre que satisfaga los requisitos y las restricciones de V1.

### 3. Stakeholders, usuarios y escenarios

### 3.1 Actores y necesidades

| Actor | Necesidad | Responsabilidad |
| --- | --- | --- |
| Analista financiero | Series económicas y financieras con referencias; informes reproducibles. | Elegir indicadores, interpretar y publicar reporte. |
| Estudiante/docente | Estudios comparativos con fuentes confiables y presentación clara. | Investigar, revisar y citar. |
| Investigador/ONG | Indicadores sociales y ambientales con cobertura/método visible. | Documentar análisis y límites. |
| Responsable de producto | Catálogo fiable y evolución controlada de capacidades. | Aprobar requisitos y priorizar. |
| Proveedor estadístico | Uso correcto de series, metadatos y condiciones. | Publicar datos; no depende del sistema. |
| Administrador futuro | Administrar catálogo, soporte y calidad de datos. | Rol fuera de V1 autónoma. |

### 3.2 Escenario operativo de referencia

La persona inicia un reporte nuevo, asigna título y propósito.

Abre una de las diez categorías y escoge un indicador de un catálogo acotado.

Configura filtros válidos para ese indicador (territorio, período, frecuencia).

Consulta la fuente y revisa datos, unidad, serie disponible y metadatos.

Crea una gráfica y, de ser aplicable, compara dos entidades de forma compatible.

Agrega la gráfica o tabla al documento y redacta o dicta su interpretación.

Guarda el borrador; más tarde lo reabre y continúa editándolo.

Exporta un PDF que conserva texto, visualizaciones y referencias.

### 3.3 Experiencias alternativas

Si el navegador no tiene reconocimiento de voz o se deniega el micrófono, se mantiene entrada por texto.

Si la API no responde, se informa del fallo; no se muestra información inventada o indebidamente actualizada.

Si una combinación de filtros no produce datos, se propone un período/escala disponible y no se fabrica una serie.

Si los indicadores no son comparables, se explica el motivo y se impide la superposición engañosa.

Si el borrador no puede guardarse, se advierte antes de abandonar y se ofrece un mecanismo viable de recuperación/exportación según diseño.

### 4. Catálogo temático: diez categorías en V1

Cada categoría deberá ofrecer al menos una vista analítica útil, un indicador seleccionado y verificado, filtros apropiados, metadatos, visualización y acción “Añadir al reporte”. La cobertura geográfica y temporal se determinará por indicador. No se garantizará disponibilidad subnacional o histórica no respaldada por la fuente.

| ID | Categoría | Indicadores candidatos / experiencia | Fuentes previstas |
| --- | --- | --- | --- |
| CAT-01 | Inflación y costo de vida | Inflación/INPC y variación de precios | INEGI |
| CAT-02 | Actividad económica y crecimiento | PIB, actividad económica, sectores | INEGI / Banco Mundial |
| CAT-03 | Empleo y mercado laboral | Desocupación, ocupación, informalidad | INEGI |
| CAT-04 | Ingresos y gasto de hogares | Ingreso/gasto por rubros y distribución | INEGI/ENIGH |
| CAT-05 | Tasas de interés y tipo de cambio | Tasas y tipo de cambio | Banco de México |
| CAT-06 | Empresas y sectores productivos | Establecimientos por actividad y tamaño | INEGI/DENUE |
| CAT-07 | Población y demografía | Población, edades y crecimiento | INEGI / Banco Mundial |
| CAT-08 | Vivienda e infraestructura | Servicios básicos y características de vivienda | INEGI / Banco Mundial |
| CAT-09 | Educación y capital humano | Escolaridad, alfabetización, educación | INEGI / Banco Mundial |
| CAT-10 | Medio ambiente y sostenibilidad | CO2, agua, energía | Banco Mundial / INEGI |

### 4.1 Registro controlado de indicadores

Antes de implementar cada tarjeta de indicador, se verificará y registrará: código original, nombre oficial, organismo, enlace al conjunto o ficha metodológica, unidad, periodicidad, territorios disponibles, fechas inicial/final, estado del dato cuando exista, condiciones de uso y forma de consulta. El catálogo validado será parte del entregable de datos, no una suposición del SRS.

### 4.2 Política para diez categorías

V1 no implica cientos de datasets: significa diez secciones temáticas activas con un caso de análisis end-to-end cada una. El catálogo podrá crecer posteriormente. Si una fuente prevista no cumple permisos, calidad o disponibilidad, el requisito deberá resolverse mediante fuente oficial alternativa aprobada o mediante un cambio de alcance registrado; no se declarará completo un módulo vacío.

### 4.3 Fuentes candidatas, no arquitectura

| Fuente | Uso | Condición relevante |
| --- | --- | --- |
| INEGI Banco de Indicadores | Indicadores y metadatos de México | Token de acceso; disponibilidad geográfica varía por indicador. |
| INEGI DENUE | Establecimientos por área/sector/tamaño | Servicio específico; validación de uso y consultas. |
| INEGI ENIGH | Ingresos/gastos de hogares | Disponibilidad por levantamiento/tabulado; no toda serie es dinámica. |
| Banco Mundial API V2 | Comparaciones internacionales | Acceso público sin clave; series pueden tener datos faltantes. |
| Banco de México SIE | Tasas y tipo de cambio | Validar autorización, términos y series específicas. |

### 5. Historias de usuario y casos de uso

### 5.1 Historias de usuario priorizadas

HU-01  Como investigador, quiero explorar diez categorías, para localizar rápidamente un área temática.  [M]

HU-02  Como analista, quiero buscar y elegir un indicador oficial, para evitar búsquedas dispersas.  [M]

HU-03  Como estudiante, quiero filtrar por territorio y período válidos, para obtener datos pertinentes.  [M]

HU-04  Como analista, quiero comparar dos territorios bajo una misma metodología, para identificar diferencias confiables.  [M]

HU-05  Como investigador, quiero ver la fuente, unidad y fecha de actualización, para evaluar la confiabilidad de una cifra.  [M]

HU-06  Como usuario, quiero crear una visualización legible, para comunicar hallazgos.  [M]

HU-07  Como usuario, quiero hablar una consulta o escribirla, para interactuar de la forma más cómoda.  [M]

HU-08  Como usuario, quiero corregir la transcripción antes de consultar, para evitar acciones incorrectas.  [M]

HU-09  Como estudiante, quiero crear un reporte e insertar una gráfica, para redactar un estudio completo.  [M]

HU-10  Como analista, quiero escribir, dar formato y reorganizar secciones, para presentar análisis profesional.  [M]

HU-11  Como analista, quiero dictar texto en el editor, para reducir tiempo de captura.  [M]

HU-12  Como usuario, quiero guardar y reabrir borradores, para continuar mi trabajo.  [M]

HU-13  Como usuario, quiero exportar un PDF con referencias, para compartir hallazgos trazables.  [M]

HU-14  Como investigador, quiero identificar vacíos y falta de comparabilidad, para evitar conclusiones engañosas.  [M]

HU-15  Como usuario, quiero revisar todas las fuentes del documento, para comprobar qué respalda cada gráfico.  [M]

HU-16  Como usuario móvil, quiero consultar y editar funciones esenciales desde el celular, para trabajar sin app nativa.  [M]

HU-17  Como usuario, quiero duplicar un reporte existente, para reutilizar su estructura.  [S]

HU-18  Como usuario, quiero exportar una tabla en formato tabular, para reutilizarla fuera de la web.  [C]

### 5.2 Casos de uso principales

CU-01 · Explorar y consultar indicador

Flujo principal: Usuario abre categoría > selecciona indicador > configura filtros válidos > solicita datos > visualiza resultados y metadatos.

Resultado esperado: Se muestran datos o estado explícito sin inventarlos.

CU-02 · Comparar indicadores

Flujo principal: Usuario elige indicador y dos territorios/periodos compatibles > solicita comparación > examina valores.

Resultado esperado: Se conserva unidad/método y se explican datos faltantes.

CU-03 · Consultar por voz

Flujo principal: Usuario activa micrófono > habla > revisa transcripción/interpretación > confirma > recibe visualización.

Resultado esperado: Si no hay soporte, continúa escribiendo.

CU-04 · Crear reporte

Flujo principal: Usuario crea documento > agrega título y secciones > guarda borrador.

Resultado esperado: Se puede reabrir sin pérdida de contenido confirmado.

CU-05 · Insertar gráfica

Flujo principal: Usuario genera una gráfica > pulsa “Añadir al reporte” > elige ubicación.

Resultado esperado: Gráfica insertada conserva datos y fuente.

CU-06 · Dictar interpretación

Flujo principal: Usuario coloca cursor > activa dictado > corrige texto > lo inserta.

Resultado esperado: El usuario conserva control editorial.

CU-07 · Exportar PDF

Flujo principal: Usuario previsualiza > exporta > revisa texto, gráficos, tablas y bibliografía.

Resultado esperado: El archivo conserva citas y presentación legible.

CU-08 · Gestionar un fallo de datos

Flujo principal: API falla o devuelve 0 registros > sistema señala causa conocida > ofrece reintentar.

Resultado esperado: No muestra último valor como nuevo sin advertir.

### 6. Requisitos funcionales

Formato: RF-XX identifica un requisito singular, “deberá” indica obligatoriedad, P indica prioridad Must/Should/Could y “Verificación” indica el tipo de evidencia de prueba. Requisitos de la V1 salvo indicación contraria.

### 6.1 Navegación, catálogo y descubrimiento

RF-001  El sistema deberá mostrar exactamente diez categorías temáticas activas identificadas en CAT-01 a CAT-10 para la línea base V1.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección y recorrido de categorías

RF-002  Cada categoría deberá contener al menos una consulta real, verificada y capaz de producir una vista útil con datos oficiales.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de extremo a extremo por categoría

RF-003  El usuario deberá poder buscar indicadores por nombre o palabra clave dentro del catálogo validado.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de búsqueda positiva/negativa

RF-004  Cada indicador deberá mostrar su nombre oficial, unidad, fuente, frecuencia, cobertura y fecha de disponibilidad/actualización si la fuente la ofrece.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección de ficha de indicador

RF-005  El sistema deberá separar la búsqueda de indicadores de la edición del reporte, preservando el contexto de trabajo.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de navegación con borrador activo

RF-006  El sistema deberá indicar cuando una categoría tenga opciones limitadas de indicadores o coberturas.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de estado informativo

### 6.2 Consultas y fuentes oficiales

RF-007  El sistema deberá obtener observaciones de una fuente oficial aprobada y preservar el identificador del indicador consultado.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de integración

RF-008  El sistema deberá permitir seleccionar únicamente territorios, periodos y frecuencias respaldados por el indicador seleccionado.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de validación de filtros

RF-009  El sistema deberá manejar respuestas sin datos sin crear puntos artificiales ni asumir valores cero.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba con serie vacía

RF-010  El sistema deberá distinguir valor observado de dato preliminar, estimado, corregido o ausente cuando la fuente contenga esas marcas.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba con estados de observación

RF-011  El sistema deberá distinguir la fecha de consulta de la fecha de actualización publicada por la fuente.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección de metadatos

RF-012  El sistema deberá ofrecer reintento tras fallos temporales de fuente sin duplicar datos ni ocultar el error.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de fallo de red

RF-013  Si existen datos guardados de consulta anterior, deberá identificarlos como históricos o en caché y no como datos recién consultados.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba con fuente desconectada

RF-014  El sistema deberá permitir acceder al vínculo oficial de la ficha o conjunto de datos desde una visualización.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de enlace

RF-015  El sistema deberá impedir la publicación de una consulta del catálogo cuya fuente o cobertura no haya sido validada.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección del catálogo de producción

### 6.3 Comparaciones y visualización

RF-016  El usuario deberá poder comparar dos o más series solo cuando exista compatibilidad comprobada en indicador/definición, unidad, periodicidad y cobertura temporal.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de comparación válida

RF-017  El sistema deberá bloquear o separar visualmente comparaciones incompatibles e informar al usuario la razón.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de comparación inválida

RF-018  El sistema deberá identificar los periodos faltantes; no interpolará datos de forma implícita.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de serie discontinua

RF-019  El sistema deberá presentar al menos gráfica de línea, barras, tabla de datos y tarjeta de indicador según el tipo de análisis.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de visualizaciones

RF-020  Toda visualización deberá mostrar título, unidad, periodo, cobertura territorial y fuente.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección de gráfico

RF-021  El usuario deberá poder alternar entre visualización gráfica y tabla de valores cuando corresponda.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba funcional

RF-022  El sistema deberá presentar notas metodológicas o advertencias relevantes cercanas a la visualización.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de observaciones

RF-023  Las gráficas con varias series deberán distinguirlas sin depender únicamente del color.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba visual y accesibilidad

### 6.4 Entrada por voz y texto

RF-024  El usuario deberá poder iniciar y detener reconocimiento de voz desde una acción explícita.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de micrófono

RF-025  La interfaz deberá mostrar de manera visible el estado de escucha, procesamiento, error y finalización del dictado.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de estados

RF-026  El sistema deberá convertir una consulta de voz a texto editable antes de ejecutarla.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de transcripción

RF-027  El sistema deberá interpretar dentro de un vocabulario limitado intención, indicador, territorio y periodo; si falta información, deberá solicitar confirmación.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de comandos soportados

RF-028  El sistema deberá ofrecer las mismas funciones básicas por teclado/texto cuando la voz no esté disponible, sea denegada o falle.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba sin micrófono

RF-029  El usuario deberá poder dictar texto dentro de un reporte sin que dicho dictado ejecute consultas estadísticas.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de separación de modos

RF-030  El sistema deberá permitir corregir o descartar el resultado reconocido antes de guardarlo o insertarlo.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de edición y cancelación

### 6.5 Reportes y edición

RF-031  El usuario deberá poder crear un reporte con título y contenido inicial sin crear una cuenta obligatoriamente.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de creación

RF-032  El sistema deberá ofrecer edición de párrafos, encabezados, negritas, cursivas, listas y saltos/estructuras básicas.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de editor

RF-033  El usuario deberá poder insertar una visualización existente como bloque del reporte.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de inserción

RF-034  Cada bloque insertado deberá conservar una instantánea identificable de datos, filtros, indicador, fuente y fecha de consulta.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección de bloque y exportación

RF-035  El usuario deberá poder insertar o editar tablas y texto explicativo alrededor de los gráficos.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de composición

RF-036  El usuario deberá poder mover, eliminar o duplicar bloques de contenido sin alterar los metadatos del bloque original.

Prioridad: Should (deseable)   ·   Verificación: Prueba de reordenamiento

RF-037  El sistema deberá permitir guardar un borrador y reabrirlo desde la misma instalación/origen en las condiciones de persistencia definidas para V1.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de persistencia

RF-038  El sistema deberá indicar si existen cambios no guardados o si el guardado ha fallado.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de error de guardado

RF-039  El usuario deberá poder renombrar, duplicar o eliminar sus reportes guardados; la eliminación requiere confirmación.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba CRUD de reportes

RF-040  El reporte deberá permitir al usuario escribir sus propias interpretaciones sin alteraciones automáticas del contenido sustantivo.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de integridad editorial

### 6.6 Citas, bibliografía y exportación

RF-041  Cada bloque de datos deberá ofrecer una ficha de fuente con organismo, indicador, enlace oficial, unidad, cobertura, periodo, fecha de consulta y fecha de actualización cuando exista.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección de ficha fuente

RF-042  El sistema deberá producir una sección de referencias que enumere las fuentes utilizadas por los bloques incluidos en el reporte.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de generación de bibliografía

RF-043  El sistema deberá diferenciar citas asociadas a bloques de datos de afirmaciones redactadas libremente por el usuario.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de atribución

RF-044  El usuario deberá poder previsualizar la salida antes de exportar.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de previsualización

RF-045  El sistema deberá exportar PDF con título, texto, tablas, gráficas y referencias legibles.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba PDF multipágina

RF-046  El PDF deberá preservar la instantánea de valores y referencias empleada al exportar, aunque luego cambien los datos de origen.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de reproducibilidad de reporte

RF-047  Si una gráfica no puede renderizarse o pierde datos al exportar, el sistema deberá advertir y no presentar un PDF como completo silenciosamente.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de error de exportación

RF-048  El usuario deberá poder definir autor y fecha de portada como metadatos del documento.

Prioridad: Should (deseable)   ·   Verificación: Prueba de portada

### 6.7 Responsividad, ayuda y estados

RF-049  El sistema deberá ofrecer navegación, filtros, consulta y lectura de resultados en navegadores móviles soportados.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba en viewport móvil

RF-050  El sistema deberá adaptar la composición del editor en pantallas pequeñas sin ocultar las acciones esenciales.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba responsiva

RF-051  El sistema deberá mostrar estados de carga, vacío, éxito y error en las operaciones asíncronas.

Prioridad: Must (imprescindible)   ·   Verificación: Pruebas de estados

RF-052  El sistema deberá proporcionar orientaciones sobre términos estadísticos y límites metodológicos en lenguaje comprensible.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de ayuda contextual

RF-053  El usuario deberá poder consultar las fuentes de datos utilizadas y las condiciones relevantes de uso/atribución.

Prioridad: Must (imprescindible)   ·   Verificación: Inspección de sección fuentes

RF-054  El sistema deberá evitar que errores de una API externa borren el contenido no relacionado del reporte del usuario.

Prioridad: Must (imprescindible)   ·   Verificación: Prueba de fallo parcial

### 7. Requisitos no funcionales e interfaces

### 7.1 Requisitos de calidad

| ID | Atributo y requisito verificable | Prioridad / evidencia |
| --- | --- | --- |
| RNF-001 | Disponibilidad multiplataforma — Los flujos críticos deberán funcionar en las dos últimas versiones estables de Chrome, Edge, Firefox y Safari, y en Chrome Android/Safari iOS compatibles, excepto la voz cuando el navegador carezca del servicio. | Must / Matriz de compatibilidad |
| RNF-002 | Diseño responsivo — La interfaz no deberá presentar desplazamiento horizontal global a 360, 768 y 1280 px; tablas y gráficas podrán desplazarse dentro de contenedores identificados. | Must / Prueba a tres anchos |
| RNF-003 | Accesibilidad — Objetivo WCAG 2.2 AA en los flujos críticos: teclado, foco visible, etiquetas, contraste, alternativas a gráficas y formularios con errores explicados. | Must / Auditoría manual/automática y teclado |
| RNF-004 | Rendimiento de interacción — Acciones locales comunes (abrir panel, cambiar vista, escribir) deberán responder perceptiblemente en < 200 ms en dispositivo de prueba acordado. | Should / Medición de interacción |
| RNF-005 | Carga inicial — En condiciones de laboratorio acordadas, el LCP de la vista principal deberá ser ≤ 3,5 s al percentil 75 de 20 ejecuciones. | Should / Prueba de desempeño reproducible |
| RNF-006 | Latencia de consulta — La interfaz deberá mostrar estado de carga en ≤ 300 ms; si una fuente no responde en 15 s, deberá permitir cancelar/reintentar e informar, sin prometer respuesta de la fuente. | Must / Simulación de latencias |
| RNF-007 | Exportación PDF — Un reporte patrón de 10 páginas con 5 gráficas y 2 tablas deberá exportarse en ≤ 20 s bajo condiciones de prueba documentadas. | Should / Prueba de exportación |
| RNF-008 | Integridad de datos — No se deberán redondear, interpolar o reemplazar valores faltantes de forma silenciosa; las cifras mostrarán precisión y unidad apropiadas. | Must / Pruebas de integridad |
| RNF-009 | Trazabilidad — 100% de bloques estadísticos incluidos en PDF deberán mantener referencia al indicador/organismo/consulta y contexto temporal. | Must / Verificación automatizada de metadatos |
| RNF-010 | Seguridad — Las credenciales/tokens de proveedores que deban mantenerse privados no deberán exponerse en el cliente público; no se define aún el mecanismo de resguardo. | Must / Inspección de cliente y configuración |
| RNF-011 | Privacidad — Micrófono y cualquier tratamiento relacionado con voz deberán requerir acción/permiso informado; se explicará si un proveedor externo procesa el audio. | Must / Revisión de permisos y aviso |
| RNF-012 | Minimización — No se exigirá cuenta ni datos personales para crear y exportar un reporte en V1; autor será opcional. | Must / Prueba sin registro |
| RNF-013 | Persistencia — Borradores confirmados deberán persistir después de cerrar y reabrir el navegador en el mismo entorno, salvo eliminación de datos del sitio o modo privado; limitación visible. | Must / Prueba de cierre/reapertura |
| RNF-014 | Confiabilidad — El sistema deberá evitar pérdida silenciosa de cambios ante errores de red o almacenamiento; errores deben ser visibles. | Must / Simulación de error |
| RNF-015 | Mantenibilidad — El catálogo de indicadores y reglas de compatibilidad deberán poder ampliarse sin reescribir el editor de reportes; se verificará en revisión de diseño. | Should / Revisión arquitectónica posterior |
| RNF-016 | Legibilidad de PDF — Fuentes, ejes, leyendas, notas y referencias deberán conservar lectura nítida en A4/carta según formato elegido. | Must / Inspección visual de PDF |
| RNF-017 | Usabilidad — Al menos 8/10 participantes del perfil objetivo completarán CU-01+CU-05+CU-07 con una guía breve y sin asistencia del evaluador. | Should / Prueba moderada de usabilidad |
| RNF-018 | Idioma — Etiquetas, mensajes, advertencias y ayuda de la V1 deberán estar en español claro; códigos oficiales se preservarán. | Must / Inspección lingüística |
| RNF-019 | Gestión de fallos externos — Un fallo de fuente o reconocimiento de voz no deberá impedir abrir y modificar un borrador existente. | Must / Prueba de degradación |
| RNF-020 | Compatibilidad metodológica — Se deberá cumplir al 100% el conjunto de reglas RB-01 a RB-10 antes de mostrar una comparación conjunta. | Must / Pruebas de reglas |
| RNF-021 | Protección de contenido — Texto del usuario deberá tratarse como contenido no confiable para evitar ejecución de scripts al guardar, visualizar o exportar. | Must / Prueba de contenido hostil |
| RNF-022 | Uso sostenible de APIs — Consultas deberán respetar límites y reglas de atribución de proveedores; no se garantizará acceso ilimitado. | Must / Revisión de términos y prueba de límites |

### 7.2 Interfaces externas

| Interfaz | Contrato esperado | Condiciones de error |
| --- | --- | --- |
| Navegador / usuario | Interacciones de navegación, formularios, edición, voz y PDF. | Permisos denegados; cambios de resolución; soporte parcial. |
| APIs estadísticas | Consulta de indicadores y metadatos mediante interfaces documentadas. | Timeout, cambios de esquema, 4xx/5xx, falta de registros. |
| Micrófono / reconocimiento | Entrada de habla a texto cuando esté disponible y consentida. | No soportado, permiso denegado, ruido, texto ambiguo. |
| Almacenamiento de borradores | Guardar/reabrir documentos y bloques con metadatos suficientes. | Cuota agotada, limpieza de datos, error de persistencia. |
| Generación de PDF | Representación de documento y bibliografía en archivo descargable. | Paginación, gráficos no renderizados, metadatos incompletos. |

### 7.3 Dependencias y secretos

El uso de un token del INEGI o de servicios financieros requiere registro y verificación de condiciones. El SRS no prescribe una tecnología para almacenarlos, pero prohíbe publicar como secreto un token cuya protección sea necesaria. Cualquier excepción o uso de token de acceso público deberá quedar documentado tras revisar los términos específicos.

### 8. Reglas de negocio y modelo lógico

### 8.1 Reglas de interpretación y comparabilidad

RB-01  Una comparación compartida exige unidad estadística y definición equivalentes; unidades distintas requieren visualización separada o transformación explícita, verificada y etiquetada.

RB-02  Las frecuencias incompatibles (mensual, trimestral, anual, censal) no se alinearán como si fueran observaciones del mismo periodo sin agregación metodológicamente justificada.

RB-03  Datos faltantes permanecen faltantes; no se sustituyen por cero ni se interpolan silenciosamente.

RB-04  Una gráfica y una referencia siempre deben mostrar geografía, periodo, unidad y fuente.

RB-05  Datos nacionales nunca deberán etiquetarse como datos de un estado o municipio.

RB-06  Serie preliminar/corregida se marca si el proveedor distingue el estado de observación.

RB-07  Fecha de consulta y fecha de actualización no se consideran equivalentes.

RB-08  Un reporte PDF fija un estado de los datos usados, incluso si la fuente publica nuevas cifras.

RB-09  Las conclusiones escritas por usuarios no se atribuyen automáticamente al organismo proveedor.

RB-10  La ausencia de disponibilidad territorial/temporal se presenta como limitación, no como error del usuario ni como valor cero.

RB-11  Si existen dos fuentes válidas para un concepto, el usuario deberá reconocer la fuente elegida y diferencias metodológicas.

RB-12  Una misma serie incluida varias veces puede citarse una sola vez en bibliografía, manteniendo vínculo desde cada bloque.

RB-13  La atribución y las restricciones de redistribución se aplicarán según términos de cada proveedor, verificados antes de la publicación pública.

### 8.2 Entidades de información (conceptuales, no esquema de base de datos)

| Entidad | Atributos mínimos |
| --- | --- |
| Categoría | ID, nombre, descripción, indicadores habilitados. |
| Indicador | ID interno, ID oficial, organismo, definición, unidad, frecuencia, alcance, enlace metodológico. |
| Observación | Indicador, territorio, periodo, valor, estado, notas, fecha de fuente. |
| Consulta | Indicador, filtros, fecha/hora, resultado/estado, procedencia. |
| Visualización | Tipo, consulta asociada, configuración, leyenda, notas, instantánea. |
| Reporte | ID, título, autor opcional, secciones, bloques, fecha de creación/modificación. |
| Bloque del reporte | Tipo (texto/tabla/gráfica), contenido, orden, referencias asociadas. |
| Referencia | Organismo, título oficial, URL, identificador, cobertura, periodo, consulta/actualización. |

### 8.3 Ciclo de vida de un reporte

Nuevo → Borrador editable → Guardado → Reabierto/Editado → Vista previa → Exportado. La exportación crea un archivo de salida y no cierra ni bloquea el borrador. Un reporte podrá eliminarse mediante confirmación; el mecanismo para recuperación tras borrado queda fuera de V1.

### 9. Verificación, criterios de aceptación y trazabilidad

### 9.1 Estrategia de verificación

Cada requisito se validará por al menos uno de estos métodos: inspección de interfaz, prueba funcional, prueba de integración, prueba con fuente simulada, medición de desempeño, auditoría de accesibilidad o prueba guiada con usuario. No se considerarán cubiertos los RF únicamente por disponer de un diseño visual.

### 9.2 Escenarios de aceptación end-to-end

| ID | Prueba | Resultado esperado | RF |
| --- | --- | --- | --- |
| CA-01 | Exploración de categorías | Dadas las diez categorías, al abrir cada una debe existir una consulta validada que produzca resultados, o un estado explícito si la fuente está caída. | RF-001/002/007 |
| CA-02 | Consulta con filtros válidos | Dado un indicador con dos territorios habilitados, al seleccionar período compatible se muestran observaciones y metadatos. | RF-004/008/020 |
| CA-03 | Consulta sin datos | Dado un periodo sin observaciones, el resultado indica “sin datos” y no dibuja cero como si fuese un valor observado. | RF-009/018 |
| CA-04 | Comparación incompatible | Dadas dos series con unidades o métodos incompatibles, la app bloquea superposición o las separa con explicación. | RF-016/017 |
| CA-05 | Voz soportada | Al dictar una consulta soportada, se muestra transcripción editable, usuario confirma y se ejecuta. | RF-024/027 |
| CA-06 | Voz no soportada | Con permiso denegado o navegador sin servicio, queda habilitado un campo de consulta por texto. | RF-028 |
| CA-07 | Reporte trazable | Al insertar una gráfica, guardar, reabrir y exportar, persisten filtros, valores y referencia. | RF-033/034/037/041/046 |
| CA-08 | Dictado editorial | El dictado en texto inserta palabras sin consultar datos; usuario puede editar antes de guardar. | RF-029/030 |
| CA-09 | PDF completo | Reporte patrón con títulos, dos tablas, cinco gráficas y citas se exporta legiblemente con bibliografía. | RF-042/045/047 |
| CA-10 | Fallo de fuente | API responde error; el usuario recibe estado y puede seguir redactando su reporte. | RF-012/054 |
| CA-11 | Móvil | En 360 px el usuario navega categorías, consulta y accede a edición/exportación sin scroll horizontal global. | RF-049/050 |
| CA-12 | Persistencia del borrador | Cerrar y reabrir navegador del mismo dispositivo restaura el reporte guardado, sujeto a no borrar los datos del sitio. | RF-037/038 |

### 9.3 Matriz de trazabilidad de alto nivel

| Objetivo | HU relacionadas | RF relacionadas | Pruebas CA |
| --- | --- | --- | --- |
| OBJ-01 | HU-01/02/03 | RF-001 a RF-015 | CA-01/02/03 |
| OBJ-02 | HU-04/05/06/14 | RF-016 a RF-023 | CA-02/04 |
| OBJ-05 | HU-07/08/11/16 | RF-024 a RF-030, RF-049/050 | CA-05/06/08/11 |
| OBJ-06 | HU-09/10/12/13 | RF-031 a RF-048 | CA-07/09/12 |
| OBJ-04 | HU-05/13/14/15 | RF-004/010/011/017/034/041/046 | CA-03/04/07/09 |
| OBJ-03 | HU-02/03/04/06 | RF-003/008/016/019 | CA-02/04 |

### 9.4 Definición de terminado (DoD) de V1

Las diez categorías cumplen CAT-01…CAT-10 mediante al menos un indicador verificado por categoría.

Los requisitos Must cumplen sus verificaciones sin defectos bloqueantes.

El recorrido de datos → visualización → reporte → guardado → PDF conserva metadatos y legibilidad.

Pruebas de comparación inválida y ausencia de datos demuestran tratamiento correcto.

La función de voz trabaja donde existe soporte y ofrece fallback completo por texto.

La matriz de compatibilidad, accesibilidad y el checklist de APIs están documentados.

Existe manual breve que informa límites de fuentes, almacenamiento local y finalidad no asesoría.

### 10. Riesgos, supuestos y puntos abiertos

### 10.1 Registro de riesgos

| ID | Riesgo | Severidad | Mitigación de producto |
| --- | --- | --- | --- |
| R-01 | Cobertura desigual de INEGI por municipio/serie. | Alta | Catálogo curado; filtros válidos por indicador. |
| R-02 | Tokens, límites o términos de APIs impiden prototipo público. | Alta | Validar fuentes y modalidad de uso antes del diseño final. |
| R-03 | Volumen del editor PDF convierte MVP en proyecto largo. | Alta | Construir recorrido vertical primero; no perseguir paridad con Word. |
| R-04 | Voz inconsistente entre navegadores/dispositivos. | Media | Fallback texto y corrección explícita. |
| R-05 | Almacenamiento local se pierde al limpiar navegador. | Media | Advertencia, exportación de PDF y decisión posterior sobre respaldo. |
| R-06 | Comparaciones engañosas por frecuencia o metodología. | Alta | Reglas RB y validación de metadatos. |
| R-07 | Datos o dashboards quedan obsoletos. | Media | Fecha de consulta y actualización; estado histórico. |
| R-08 | PDF difiere de la vista de edición. | Media | Pruebas multipágina y vista previa. |
| R-09 | Fuga de tokens o exposición de datos del usuario. | Alta | Revisión de seguridad y privacidad; no fijar arquitectura prematura. |

### 10.2 Decisiones abiertas (no son requisitos incumplidos)

| ID | Tema | Resolución que se espera en etapas siguientes |
| --- | --- | --- |
| DA-01 | Nombre y marca | Decidir nombre corto, personalidad visual y disponibilidad legal/dominio. |
| DA-02 | Catálogo exacto | Elegir 1–3 indicadores por categoría y verificar IDs, cobertura, metodología y licencias. |
| DA-03 | Persistencia | Definir mecanismo sin exigir cuentas y límites/plan de migración. |
| DA-04 | API y credenciales | Determinar adaptadores, CORS, resguardo de tokens y modos de errores. |
| DA-05 | Editor y PDF | Definir representación de documentos, tamaño de página y tecnología. |
| DA-06 | Voz | Elegir reconocimiento compatible; considerar datos enviados a proveedores y fallback. |
| DA-07 | UX/storytelling | Definir sistema visual, arquitectura de información, estados y microinteracciones. |
| DA-08 | Datos financieros | Confirmar series y condiciones Banxico; si es inviable, documentar alternativa oficial. |
| DA-09 | Revisión de desempeño | Establecer dispositivo/red de referencia para umbrales RNF. |
| DA-10 | Sincronización futura | Evaluar cuentas, nube, colaboración, IA y otros idiomas únicamente tras V1. |

### 10.3 Dependencias críticas para arrancar

Confirmar un indicador verificable por categoría; especialmente ENIGH, DENUE y Banco de México.

Elaborar prototipo UX de la ruta dato → gráfica → informe → PDF y probarlo con 3–5 usuarios.

Definir arquitectura y seguridad de consumo de APIs/credenciales.

Refinar estimaciones y calendario a partir del primer flujo vertical implementado.

### 11. Estrategia de realización, términos y referencias

### 11.1 Secuencia recomendada sin prescribir tecnología

| Fase | Resultado tangible | Alcance |
| --- | --- | --- |
| Vertical 0 | Un dato real, una gráfica y un PDF con referencia | Demostrar el ciclo completo; 1 categoría y 1 serie. |
| Vertical 1 | Explorador, comparación y editor estable | 2 categorías de distinta fuente, voz y persistencia. |
| V1 completa | Diez categorías verificadas, controles de calidad y pruebas | Reutilizar componentes, ampliar catálogo y terminar DoD. |
| V2 posible | Cuentas, sincronización, colaboración, más datos, IA asistiva | Fuera del SRS V1; reespecificar cuando proceda. |

### 11.2 Glosario

| Término | Definición de trabajo |
| --- | --- |
| Indicador | Medida estadística identificada y documentada por un organismo proveedor. |
| Serie | Conjunto de observaciones correspondientes a un indicador a través de periodos o territorios. |
| Cobertura | Alcance geográfico, temporal y poblacional de la fuente. |
| Metadato | Información sobre definición, metodología, unidad, frecuencia, fuente, actualización o estado. |
| Dashboard | Vista interactiva y temática que organiza indicadores y visualizaciones. |
| Bloque de reporte | Elemento insertado en documento: texto, tabla, gráfica u otro objeto referenciado. |
| Instantánea / snapshot | Estado de datos y configuración usado en un informe al momento de incorporarlos/exportarlos. |
| Dato faltante | Valor no disponible; no equivale a cero. |
| MVP / V1 | Primera entrega operacional acotada del producto. |
| SRS | Software Requirements Specification; especificación de requisitos de software. |

### 11.3 Documentos y fuentes consultables

STD-01  ISO/IEC/IEEE 29148:2018 (ISO)  ·  https://www.iso.org/standard/72089.html

STD-02  ISO/IEC/IEEE 29148:2018 (IEEE)  ·  https://standards.ieee.org/ieee/29148/6937/

STD-03  WCAG 2.2 (W3C)  ·  https://www.w3.org/TR/WCAG22/

API-01  INEGI Banco de Indicadores  ·  https://www.inegi.org.mx/servicios/api-indicadores/

API-02  INEGI DENUE  ·  https://www.inegi.org.mx/servicios/api_denue.html

DATA-01  INEGI ENIGH 2024  ·  https://www.inegi.org.mx/programas/enigh/nc/2024/

API-03  World Bank Indicators API v2  ·  https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

API-04  Banco de México SIE API  ·  https://www.banxico.org.mx/SieAPIRest/swagger/index.html

Consulta documental realizada el 11/11/2026. Las referencias a APIs y estándares orientan el alcance, pero no sustituyen la validación de endpoints, series, licencias, tokens ni pruebas sobre datos antes del desarrollo.

### 11.4 Aprobación y próxima fase

La línea base SRS-DATOS-001 v1.0 queda lista para revisión de requisitos, no para afirmar la disponibilidad técnica de los diez módulos. La siguiente etapa recomendada es diseño UX/storytelling y un catálogo de indicadores verificados; después arquitectura, system design, stack y planes de implementación con contexto para Codex.
