# Primera fuente: API de indicadores del Banco Mundial

**Estado:** CAT-10 tiene una primera consulta funcional; las demás categorías siguen en preparación.  
**Fecha de verificación:** 13 de noviembre de 2026.

## Por qué esta API

La [API V2 de indicadores](https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures) permite consultar series por país, código de indicador y periodo en JSON, sin token para la consulta pública. Es una sola integración que podría alimentar varios temas de Prismo. Cada indicador requiere revisar definición, unidad, cobertura, fechas y licencia antes de habilitarse.

| Categoría | Indicador candidato | Código | Estado |
|---|---|---|---|
| CAT-07 Población | [Población total](https://data.worldbank.org/indicator/SP.POP.TOTL) | `SP.POP.TOTL` | Candidato; sin activar |
| CAT-08 Vivienda e infraestructura | [Acceso a electricidad (% de población)](https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS) | `EG.ELC.ACCS.ZS` | Candidato; sin activar |
| CAT-09 Educación | [Matrícula primaria, porcentaje bruto](https://data.worldbank.org/indicator/SE.PRM.ENRR) | `SE.PRM.ENRR` | Candidato; sin activar |
| CAT-10 Medio ambiente | [Superficie forestal (% de superficie terrestre)](https://data.worldbank.org/indicator/AG.LND.FRST.ZS) | `AG.LND.FRST.ZS` | Activo para diez países seleccionables |

## Consulta habilitada

El backend separado `prismo-api/` acepta únicamente `wb-forest-area-share` para México, Estados Unidos, Canadá, Brasil, Argentina, Chile, Colombia, Perú, España y Alemania. Admite de uno a cuatro países por consulta; usa la ruta de países separados por punto y coma que documenta la [API V2](https://datahelpdesk.worldbank.org/knowledgebase/articles/898581). Por ejemplo, consulta `GET https://api.worldbank.org/v2/country/MEX;BRA/indicator/AG.LND.FRST.ZS?format=json&date=2020:2024&per_page=500` y normaliza la respuesta como `DatasetSnapshot`. La ficha oficial describe una proporción de superficie terrestre con bosque, publicada en World Development Indicators con origen FAOSTAT/FAO y licencia CC BY 4.0. La frecuencia es anual y la unidad es porcentaje; no se presenta como dato estatal ni como medición diaria.

Las respuestas públicas de México y de México con Brasil se verificaron en vivo el 13 de noviembre de 2026 y se guardaron muestras sin secretos en `prismo-api/tests/fixtures/`. Las observaciones de 2024 fueron `34.1538414053859 %` para México y `58.5468405650061 %` para Brasil. También se verificaron los otros ocho países por grupos a través del backend local; una consulta a España y Alemania agotó el tiempo de espera y funcionó al reintentar. La interfaz ofrece listas de países y años verificados (1990–2024); después de consultar muestra tarjetas, tabla y procedencia. Debajo se configuran y seleccionan tres vistas: tendencia SVG, barras para un año común y tabla. Un valor `null` se muestra como «Sin dato» y deja un hueco en la línea; nunca se convierte en cero.

El snapshot conserva por separado `fetchedAt` (hora de consulta) y `latestObservationPeriod` (año del último valor disponible). El proveedor no da una fecha de publicación inequívoca para cada observación; `sourcePublishedAt` permanece ausente y la interfaz muestra «No informada». La marca `lastupdated` del encabezado de la API no se usa como sustituto de esa fecha.

## Pruebas y siguiente corte

El adaptador valida forma, paginación, código de indicador, país y observaciones con Zod. Las pruebas cubren datos nulos, filtros inválidos, respuesta ajena al indicador, comparación real de dos países y fallo de red. Las pruebas E2E cubren dashboards, tabla, procedencia, error y reintento, además de creación y reapertura del reporte con gráficos y snapshot guardado. La exportación PDF y la ampliación del catálogo quedan para un siguiente corte.
