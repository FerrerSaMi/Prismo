# Dirección visual del editor de Prismo

**Estado:** primer editor implementado; quedan pendientes funciones avanzadas y exportación PDF.  
**Base:** referencia visual compartida por el responsable del proyecto y `PRISMO_PRODUCT_UX_v1.2.md` (P05), `PRISMO_SRS_v1.0.md` (RF-031 a RF-048) y `PRISMO_SYSTEM_DESIGN_v1.0.md` (§11–12).

## Composición

La referencia propone un entorno de escritura con **barra superior**, **recursos a la izquierda** y **hoja central**. Prismo conservará esa lectura espacial con su paleta marfil, café y olivo, y con una barra de formato discreta.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Prismo / título del reporte          Guardado local  Vista previa  Exportar PDF │
├───────────┬────────────────────┬────────────────────────────────────────────┤
│ Menú      │ Panel contextual   │ Barra de formato                            │
│ izquierdo │ Estructura         ├────────────────────────────────────────────┤
│           │ Análisis guardados │        Hoja editable centrada              │
│           │ Fuentes            │        Texto + tablas + gráficas           │
│           │ Elementos          │                                            │
└───────────┴────────────────────┴────────────────────────────────────────────┘
```

- **Menú izquierdo plegable:** conecta el editor con Explorar datos, Mis reportes y Ayuda. El control para contraerlo o expandirlo vive al pie del panel; el logo regresa a Inicio. Dentro del editor, abre paneles de estructura del documento, análisis guardados, fuentes y elementos insertables.
- **Panel contextual:** muestra los elementos del apartado elegido. Las fuentes y los análisis provienen de datos consultados y guardados, no de miniaturas ficticias.
- **Hoja central:** superficie blanca o muy clara, ancho cómodo para lectura, con márgenes de página y desplazamiento vertical. Los bloques de datos conservan título, unidad, periodo y procedencia visibles.
- **Barra de formato:** encabezados, párrafos, negritas, cursivas, listas y tablas; controles con texto accesible y atajos de teclado. Puede ser fija o contextual según las pruebas de uso.
- **Barra superior:** título editable, estado de guardado local, vista previa y exportación. No mostrar «guardado» hasta recibir confirmación de IndexedDB.
- **Ficha de fuente:** se abre al seleccionar una gráfica o tabla. Conserva organismo, enlace, indicador, filtros, fechas y notas. En escritorio puede ocupar un panel derecho opcional; al escribir se oculta para dar prioridad a la hoja.

## Comportamiento

El acceso al editor partirá de **Mis reportes** o de **Añadir al reporte** tras una consulta real. El primer documento podrá iniciar en blanco. Un botón **Insertar análisis** abrirá la biblioteca de visualizaciones guardadas; no habrá datos de ejemplo presentados como oficiales.

En móvil, la hoja ocupa el ancho disponible. El menú y los recursos se muestran como paneles superpuestos, con cierre por botón y tecla Escape. La barra de formato se reduce a las acciones esenciales y permite acceder a las demás sin desplazamiento horizontal de toda la página.

Las transiciones serán breves y funcionales: abrir panel, seleccionar bloque y confirmar guardado. Se respetará `prefers-reduced-motion`. El editor no incluirá funciones de «texto mágico» ni redacción automática, de acuerdo con la decisión de que el autor conserve el control editorial. La voz continúa marcada como **Próximamente**.

## Estado de implementación

El primer recorrido ya permite consultar superficie forestal y abrir un estudio de dashboards de tres zonas. La galería permite activar, seleccionar y ordenar la tendencia, la comparación anual y la tabla. El lienzo presenta la vista elegida con datos reales y procedencia; el inspector permite modificar título, países visibles, colores, año de comparación, puntos y etiquetas de gráfica, y estilo y filas de tabla. Las vistas seleccionadas pasan en ese orden a un reporte nuevo o existente. En el reporte, cada bloque se puede mover entre párrafos, reducir, retitular, recolorear, cambiar de fuente y tamaño de letra o eliminar. La biblioteca inserta otra vista de una consulta guardada en el cursor. El documento tiene controles generales de tipografía y un sello «Creado con Prismo» al pie derecho. Tiptap guarda texto y nodos de gráfica o tabla; Dexie conserva el borrador, las opciones visuales y la instantánea consultada. Las pruebas E2E comprueban la consulta, edición, orden, borrado, reinserción y recuperación tras recargar. Faltan tablas de contenido editable y exportación PDF con referencias verificadas.

**Actualización 13/11/2026:** el catálogo ahora separa tema, sección e indicador; los ocho indicadores disponibles muestran su fuente. El editor incluye fuentes y colores por selección, hojas visuales y descarga PDF con referencias y sello. La paginación visual aún tiene la limitación descrita en [PDF_EXPORT.md](PDF_EXPORT.md). Este apartado de estado anterior se conserva como registro del primer corte.
