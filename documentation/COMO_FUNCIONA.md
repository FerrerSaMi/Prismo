# Cómo funciona Prismo

Prismo permite elegir un indicador oficial, revisar sus observaciones, diseñar vistas y escribir un reporte con esas vistas y sus fuentes. La persona usuaria interpreta los datos; la aplicación no redacta conclusiones automáticamente.

## 1. Inicio y catálogo

La portada explica el recorrido y acredita a INEGI y Banco Mundial como fuentes conectadas. En el encabezado de **Procedencia visible**, junto a «Conectadas», muestra «Futuras: OCDE, ONU · ODS y FAOSTAT · Próximamente», con enlaces a sus sitios oficiales; esas APIs aún no alimentan consultas de Prismo. **Entrar al espacio** abre la navegación de trabajo. El logo vuelve a Inicio; el menú lateral izquierdo se puede contraer y, en móvil, abrir como panel. El tema claro u oscuro se guarda en este navegador. La hoja del reporte y el lienzo de la vista previa permanecen blancos para conservar una lectura semejante a la salida impresa.

**Explorar datos** organiza los temas en secciones y tarjetas de indicadores. Se pueden buscar y filtrar tarjetas disponibles o marcadas como **Próximamente**. Cada tarjeta disponible muestra la fuente antes de abrir la consulta. No se ofrecen campos libres para escribir países, entidades o años: los filtros usan opciones curadas y menús animados. Si un menú está cerca del borde inferior de la ventana, se abre hacia arriba; las opciones restantes se recorren dentro del menú.

## 2. Consulta y lectura de datos

La persona elige entre uno y cuatro territorios distintos, además de un rango permitido. Los cuatro indicadores del Banco Mundial admiten los diez países del catálogo. Los cuatro indicadores de INEGI admiten México nacional y diez entidades. La selección se aplica al pulsar **Consultar**; cambiar un filtro por sí solo no altera una consulta ya mostrada.

El frontend pide un `DatasetSnapshot` a la API separada. Durante la petición se ve una animación durante al menos dos segundos. Si falla la red o la fuente, aparece un mensaje recuperable y una opción para reintentar. La respuesta válida presenta valores, unidad, periodo, estados **Sin dato**, organismo, indicador, fecha de consulta y enlace público de procedencia. La fecha de consulta no equivale al periodo del dato.

**Sin dato** significa que el proveedor no devolvió un valor para esa combinación; no se convierte en cero ni se interpola. Una comparación usa observaciones del **mismo indicador y la misma unidad**. Las barras requieren un periodo con datos para todos los territorios elegidos; la vista de cambio necesita dos periodos comunes. La selección de un rango no garantiza observaciones en cada año.

## 3. Editor de dashboards

Después de consultar, **Ir al editor de dashboards** lleva a un estudio con tres zonas: galería de vistas, lienzo central e inspector. Hay cinco vistas:

| Vista | Qué muestra | Requisito adicional |
| --- | --- | --- |
| Tendencia | Serie por territorio a través del tiempo | Al menos una serie con valor |
| Comparación | Valores de varios territorios en un periodo | Dos territorios y un periodo común |
| Tarjetas de valor | Valor elegido por territorio | Un periodo observado |
| Cambio entre periodos | Diferencia entre dos observaciones | Dos periodos comunes |
| Tabla de valores | Cifras y ausencias explícitas | Observaciones de la consulta |

La galería permite activar una vista, elegir cuáles van al reporte y ordenar las seleccionadas. El inspector cambia título, altura, tipografía, alineación, colores hexadecimales, series visibles y las opciones propias de cada tipo. Cada color reúne muestras, selector visual y campo hexadecimal en un único menú. El lienzo muestra los cambios junto con la procedencia de los datos. Las vistas se crean a partir del snapshot recibido; no son cifras de ejemplo.

Al continuar, se crea un reporte local o se agregan las vistas a uno existente. La configuración visible de cada vista queda dentro de su `ChartSpec`.

## 4. Reporte editable

**Mi espacio de trabajo** lista los reportes guardados en este navegador. Cada tarjeta abre un borrador; la eliminación requiere mantener presionado el control para evitar borrados accidentales.

El editor usa Tiptap para el texto y un nodo propio para cada dashboard. Se pueden escribir títulos, párrafos, listas y citas; aplicar negrita, cursiva y otros formatos; y alinear texto. El panel **Formato** está a la derecha y sigue la ventana mientras se recorre el reporte. Se cierra con la **×**, Escape o un clic fuera. En pantallas estrechas flota sobre la interfaz y se puede retirar para volver a la hoja.

Cada dashboard del reporte conserva su fuente y se puede retitular, recolorear, alinear, cambiar de fuente, ajustar en altura, redimensionar desde la esquina, mover entre bloques o eliminar. **+ Dashboard** inserta otra vista disponible junto al cursor. El tamaño visual de la información se ajusta al ancho del bloque. El sello inferior muestra el logo y dos líneas: **Creado con Prismo** y **Datos con procedencia · análisis de tu reporte**.

El editor muestra hojas y pasa bloques completos a la siguiente cuando corresponde. Los borradores, su JSON de edición y los snapshots se guardan en IndexedDB mediante Dexie. El estado **Guardado localmente** aparece después de confirmarse el guardado. Los reportes de un navegador no se sincronizan automáticamente con otros dispositivos.

## 5. Vista previa y PDF

**Vista previa** genera un PDF local y lo abre antes de descargarlo. **Descargar PDF** utiliza el mismo documento y los snapshots guardados, sin volver a llamar a la API. La exportación incluye texto seleccionable, representación de las cinco vistas, valores, referencias enlazadas, logo y numeración A4. La composición PDF no es una captura idéntica de la hoja web: algunas fuentes se sustituyen por familias estándar y la paginación puede diferir. Los detalles están en [Exportación PDF](../prismo/docs/PDF_EXPORT.md).

## Lo que aparece como próximo

La consulta por voz y las categorías sin indicador verificado se muestran como **Próximamente**. No existe una función de redacción automática ni se presentan datos ficticios como oficiales.

La planificación con IA, la redacción asistida, el lector de dashboards, la entrada por voz y los estudios integrados con varios indicadores figuran únicamente como [propuestas futuras](PROPUESTAS_FUTURAS.md).
