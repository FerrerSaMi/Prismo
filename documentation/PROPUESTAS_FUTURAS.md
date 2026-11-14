# Propuestas futuras de Prismo

**Estado:** ideas aprobadas para explorar, sin implementación ni fecha comprometida. La aplicación actual se describe en [Cómo funciona Prismo](COMO_FUNCIONA.md). Esta hoja no amplía el catálogo de indicadores habilitados ni anuncia funciones disponibles.

## 1. Integración de IA

### Asistente para encontrar fuentes y construir dashboards

La persona describe por escrito el propósito del reporte, la pregunta que quiere responder, los territorios y el periodo deseado. El asistente propone un plan: indicadores oficiales del catálogo verificado, fuente y definición de cada uno, filtros aplicables y dashboards que podrían responder la pregunta. También explica por qué relaciona cada indicador con el objetivo. La persona revisa y confirma el plan antes de ejecutar consultas o incorporar vistas al reporte.

La IA recomendaría **IDs y filtros curados**, no URLs ni códigos inventados. El BFF seguiría validando la consulta y devolvería snapshots de datos reales. Una sugerencia sin indicador verificado se mostraría como no disponible, con la razón y una alternativa cuando exista. Los metadatos oficiales pueden ayudar a verificar definición, unidad y cobertura: [API y catálogos de INEGI](https://www.inegi.org.mx/servicios/api-indicadores/) y [metadatos del Banco Mundial](https://datahelpdesk.worldbank.org/knowledgebase/articles/1886695-metadata-api-queries).

**Ejemplo propuesto:** “Quiero explicar cambios en empleo y educación en México y compararlos con otro país durante la última década”. El asistente presentaría primero los indicadores disponibles y advertiría cuando la cobertura estatal de INEGI y la cobertura nacional del Banco Mundial impidan una comparación directa.

### Asistente para redactar el reporte

Después de elegir dashboards, la persona indica qué quiere argumentar o profundizar. La IA propone un esquema y borradores de título, introducción, análisis por vista y cierre. Cada cifra propuesta debe estar respaldada por un `DatasetSnapshot` del reporte e identificar indicador, territorio, unidad y periodo. El texto distinguiría observación de interpretación y señalaría datos faltantes. La persona inserta, edita o descarta cada sugerencia desde el editor; Prismo no debe presentar una conclusión generada como hecho oficial.

El borrador no debería cambiar de forma silenciosa al modificar o borrar un dashboard. Una revisión futura podría avisar que una frase quedó sin la evidencia que la sustentaba.

### Lector de dashboards

Al seleccionar un dashboard, la IA ofrecería hallazgos descriptivos verificables: valor más reciente, máximo y mínimo observados, cambio entre dos periodos, diferencia entre territorios cuando es comparable y presencia de datos faltantes. Cada hallazgo mostraría las observaciones exactas de las que se calculó y una acción para añadirlo al texto. “Subió de X a Y” sería un cálculo comprobable; “subió por causa de Z” requeriría otra evidencia y no se afirmaría automáticamente.

Estas tres funciones comparten una regla: la IA ayuda a explorar y escribir, mientras los números provienen de la API validada y de snapshots guardados. Un despliegue futuro tendría que definir proveedor de IA, costes, tratamiento de datos enviados, límites de uso, evaluación de respuestas y comportamiento ante fallos. El token de INEGI permanecería exclusivamente en el backend y no formaría parte de las instrucciones enviadas al modelo.

## 2. Voz a texto para plantear el reporte

Se propone añadir una entrada **voz a texto** en el inicio de un nuevo estudio. La persona podría explicar en audio qué quiere investigar; Prismo mostraría la transcripción editable antes de enviarla al asistente de planificación. Tras corregirla, la IA extraería intención, posibles indicadores, territorios, comparación, periodo y tipo de reporte. Mostraría ese plan en controles revisables, con opciones cerradas del catálogo, antes de consultar datos.

El mismo flujo debe funcionar por escrito para quien no quiera o no pueda grabar audio. La interfaz informaría cuándo se graba, permitiría detener y borrar la grabación y explicaría si el audio o solo la transcripción se envía a un servicio externo. Hasta que se decidan proveedor, permisos, privacidad, compatibilidad y calidad de transcripción, la función seguirá marcada como **Próximamente**.

## 3. Estudios con varios indicadores

Hoy un reporte puede recibir vistas de consultas separadas y guardar varios snapshots en `ReportDocument.sources`. La mejora propuesta es planificar **varios indicadores desde un mismo estudio**, consultar cada uno con sus filtros, reunir sus dashboards en una biblioteca común y estructurar el reporte por pregunta o tema. Un caso sería comparar México y Brasil en empleo, educación y medio ambiente dentro del mismo documento.

Cada indicador conservaría su propia unidad, frecuencia, definición, territorios, periodos y procedencia. Una gráfica que combine indicadores solo se habilitaría si existe una transformación explicada y válida; reunir dashboards distintos en una página no implica que sus valores puedan sumarse o compartir eje. La vista de reporte debería indicar claramente qué fuente respalda cada bloque y qué periodos son comparables. El PDF incluiría las referencias de todos los indicadores utilizados, sin duplicados innecesarios.

## 4. Ampliación del catálogo y de las fuentes

La expansión será incremental: primero verificar un indicador concreto y sus observaciones, luego habilitar sus filtros y dashboards. Las siguientes áreas son **candidatas**, no datos ya integrados:

| Fuente candidata | Posibles temas y secciones | Qué habría que validar |
| --- | --- | --- |
| [Banco Mundial, API de indicadores](https://datahelpdesk.worldbank.org/knowledgebase/articles/898599-indicator-api-queries) | Economía: actividad, pobreza, comercio. Sociedad: población, salud, educación. Sostenibilidad: energía, emisiones, uso de suelo. | ID, definición, unidad, serie histórica, cobertura por país, frecuencia y metadatos. Ampliar países solo cuando el indicador tenga observaciones útiles. |
| [INEGI, Banco de Indicadores](https://www.inegi.org.mx/servicios/api-indicadores/) | México: empleo, hogares, educación, salud, tecnologías, demografía y otras secciones que tenga el catálogo oficial. Ampliar de diez entidades a más entidades y, donde exista, municipios. | Disponibilidad real por entidad o municipio, cambios metodológicos, unidad, vigencia, valores faltantes y límites del servicio. |
| [OCDE, API SDMX](https://sdmx.oecd.org/public/) | Economía y sociedad: productividad, empleo, educación y bienestar entre países participantes. | Estructuras SDMX, licencias, cobertura geográfica y equivalencia con indicadores ya ofrecidos. |
| [ONU, API de indicadores ODS](https://unstats.un.org/SDGAPI/swagger/) | Desarrollo sostenible: pobreza, salud, educación, igualdad, agua y clima, según los indicadores publicados. | Desagregaciones, revisiones, cobertura temporal, metadatos y diferencias respecto a series nacionales. |
| [FAOSTAT, documentación de API](https://www.fao.org/faostat/en/docs/redoc-static.html) | Alimentación, agricultura, uso de tierras y emisiones asociadas al sector. | Acceso y estabilidad del servicio, unidades, metodologías y comparabilidad con cifras ambientales del Banco Mundial. |

Antes de activar una nueva tarjeta se comprobarían respuesta real, atribución, definición, unidad, periodos, cobertura y manejo de ausencias. El adaptador del backend normalizaría al contrato común; el frontend solo mostraría opciones que ese indicador admita. La documentación y las pruebas se actualizarían por indicador, sin declarar disponible una categoría completa por tener una sola serie.

## Orden sugerido para explorar estas propuestas

1. Ampliar gradualmente el catálogo curado y el flujo de estudio con varios indicadores.
2. Prototipar el lector de dashboards con cálculos deterministas y observaciones trazables.
3. Añadir planificación asistida por texto usando únicamente indicadores verificados.
4. Probar borradores de redacción basados en snapshots y aprobación humana.
5. Incorporar voz a texto sobre el mismo plan editable cuando se resuelvan sus requisitos de privacidad y compatibilidad.

Este orden es una propuesta de producto; no implica que alguna de estas funciones ya esté construida.
