# Interfaz actual del editor

Esta nota describe el editor implementado. Para recorrer todo el producto, consulta [Cómo funciona Prismo](../../documentation/COMO_FUNCIONA.md).

## Distribución

- La barra superior muestra el regreso a **Mis reportes**, el estado de guardado local, **Vista previa** y **Descargar PDF**.
- La hoja blanca centra la escritura y los dashboards insertados. Se muestra en páginas visuales y conserva márgenes para distinguir el documento del espacio de trabajo.
- **Formato** abre un panel a la derecha que acompaña el desplazamiento. Reúne opciones de documento, título y selección de texto, además de acciones compactas de párrafo. Se cierra con la **×**, Escape o un clic fuera. En pantallas estrechas se superpone y puede retirarse para leer la hoja.
- Los controles de cada dashboard aparecen en su propio bloque. Permiten cambiar estilo y tamaño, moverlo entre bloques o eliminarlo. **+ Dashboard** inserta otra vista junto al cursor.

## Escritura y datos

Tiptap gestiona el texto y los nodos de dashboard. El documento permite títulos, párrafos, listas, citas, énfasis y alineación. Cada vista conserva el `ChartSpec` y el `DatasetSnapshot` que originaron sus valores; el editor no consulta al proveedor mientras se escribe. El sello del documento lleva el logo y las líneas **Creado con Prismo** y **Datos con procedencia · análisis de tu reporte**.

El guardado local se confirma después de escribir en Dexie/IndexedDB. La vista previa y la descarga convierten el documento en un PDF con texto, visualizaciones y referencias. La paginación de las hojas web puede diferir de la del PDF; consulta [Exportación PDF](PDF_EXPORT.md).

## Aspecto y accesibilidad

La interfaz utiliza marfil `#F6F0E4`, grafito `#17191F`, blanco `#FFFFFF` y oro `#C9A86A`. El modo oscuro usa fondo grafito y tarjetas `#272B34`; la hoja y las vistas previas se mantienen blancas para lectura e impresión. Los controles tienen nombres accesibles o ayudas contextuales, son operables con teclado y reducen las transiciones cuando el navegador solicita menos movimiento.

La voz continúa señalada como **Próximamente**. La redacción y la interpretación siguen a cargo de la persona autora.
