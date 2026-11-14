# Arquitectura y operación

## Separación de proyectos

```text
Navegador
  ├─ prismo/       React + Vite: catálogo, filtros, dashboards, Tiptap, Dexie y PDF
  │    └─ GET /api/v1/indicators/{id}/observations?geography=...&from=...&to=...
  └─ prismo-api/   Worker independiente: valida, consulta y normaliza proveedores
       ├─ Banco Mundial (API pública)
       └─ INEGI (token solo en el backend)
```

En desarrollo, Vite reenvía `/api/*` al servidor local de `prismo-api` en `127.0.0.1:8787`. En una publicación con orígenes separados, el frontend se compila con `VITE_API_BASE_URL` apuntando a la URL pública del Worker y la API recibe `FRONTEND_ORIGIN` con el origen exacto del frontend. El frontend es estático; la API no está dentro de su carpeta ni necesita servir sus archivos. Ninguno de los dos proyectos está desplegado.

## Contrato de datos

`prismo/src/domain/contracts.ts` define y valida con Zod:

1. `IndicatorDefinition`: ficha curada, unidad, proveedor, cobertura y procedencia.
2. `DatasetSnapshot`: consulta aplicada, observaciones, unidad, fecha, URL pública, versión de catálogo y estado de caché.
3. `ChartSpec`: tipo de vista, snapshot de origen, territorios y periodos visibles, colores y tamaño.
4. `ReportDocument`: título, JSON de Tiptap, snapshots usados y tipografía.

El frontend valida cada respuesta de la API antes de usarla. Las observaciones ausentes tienen `value: null` y estado `missing`; no son ceros. Los snapshots almacenan los valores utilizados para que un reporte antiguo no cambie al reabrirse o exportarse.

## Del proveedor a la pantalla

1. `prismo/src/features/explorer/ForestExplorer.tsx` o `InegiExplorer.tsx` recoge filtros de listas cerradas. `ForestExplorer` usa `forestApi.ts`; el explorador INEGI llama la misma ruta de API con su indicador. TanStack Query controla carga, error y caché de interfaz.
2. `prismo-api/src/worker.ts` admite salud y los ocho IDs curados. Rechaza métodos, rutas y filtros no admitidos. Limita cada consulta a cuatro geografías y responde con un snapshot normalizado o un error con `code` y `message`.
3. `world-bank.ts` construye la URL del indicador y países, espera hasta 18 segundos por intento, reintenta una vez fallos transitorios y valida estructura, indicador, países, paginación y valores. El Worker conserva respuestas válidas en memoria hasta 30 minutos; si falla la fuente, puede servir la misma consulta de hasta 24 horas con `cacheState: stale`. Esa memoria no se comparte entre instancias.
4. `inegi.ts` usa el token del entorno del backend y valida indicador, territorio, unidad y respuesta. El token y la URL que lo contiene nunca se envían al navegador. La procedencia visible apunta a documentación pública de INEGI.
5. `forestAnalysis.ts` calcula los periodos observados en común. `dashboardConfig.ts` crea las cinco configuraciones iniciales y `DashboardBuilder.tsx` mantiene la edición de vistas antes del reporte. Las gráficas y tablas reciben el snapshot; los periodos ausentes no se inventan.
6. `reportDb.ts` escribe `ReportDocument` en Dexie/IndexedDB. `ReportEditor.tsx` muestra el JSON de Tiptap y los nodos `evidenceChart`. `ChartNode.tsx` permite editar y mover una vista sin alterar el snapshot original.
7. `pdfExport.ts` transforma el documento y los snapshots guardados en una definición pdfmake. El logo se lee del frontend. La vista previa y la descarga ocurren en el navegador; el PDF no requiere que el backend conserve borradores.

## Catálogo y fuentes habilitadas

| Proveedor | Indicadores habilitados | Cobertura de la interfaz |
| --- | --- | --- |
| Banco Mundial | Superficie forestal, inflación al consumidor, desempleo modelado OIT, consumo de energía renovable | Diez países curados |
| INEGI | Población inmigrante, viviendas con agua entubada, unidades económicas, alfabetización de 15 a 24 años | México nacional y diez entidades |

Los IDs y unidades exactos están en `prismo/src/features/explorer/indicatorCatalog.ts`, `prismo-api/src/world-bank.ts` y `prismo-api/src/inegi.ts`. Agregar una tarjeta requiere actualizar catálogo, adaptador y filtros; comprobar definición, unidad, cobertura, periodos y respuesta real; y evitar comparaciones entre series que no sean equivalentes. Los códigos `CAT-*` siguen siendo internos y no se muestran como encabezados al usuario.

## Estado, diseño y accesibilidad

`prismo/src/App.tsx` define rutas, portada, navegación y tema. `index.css` contiene los colores base; `Theme.css` aplica las variantes. Modo claro: marfil `#F6F0E4`, blanco `#FFFFFF`, carbón `#17191F`; modo oscuro: grafito `#17191F`, tarjeta `#272B34`, texto marfil. El oro `#C9A86A` es el acento en ambos. La elección del tema vive en `localStorage`; reportes y snapshots viven en IndexedDB.

Los componentes reutilizables están en `prismo/src/components/`: `AnimatedList`, `AnimatedSelect`, `ColorMenu`, `CardNav`, `HoloCard`, `Stepper`, `WarmTooltip`, `HoldButton`, `LatticeLoader` y `LogoLoop`. Las animaciones respetan `prefers-reduced-motion`. El menú de país o año se coloca según el espacio disponible y permite desplazamiento interno. El control de formato del reporte se ubica a la derecha, permanece visible al desplazarse y se puede cerrar con clic fuera, Escape o la **×**. La hoja y el lienzo se mantienen blancos en ambos temas por su relación con el PDF.

## Desarrollo local

El backend requiere Node 24 o superior. En dos terminales:

```powershell
cd prismo-api
npm ci
npm run dev
```

```powershell
cd prismo
npm ci
npm run dev
```

El frontend usa la URL relativa `/api` en local. Para INEGI, crea `prismo-api/.dev.vars` con `INEGI_TOKEN=...`; el archivo está ignorado por Git. No coloques el token en `prismo/src`, `public` ni en variables `VITE_*`. La ruta `GET /api/v1/health` permite verificar que la API responde. Los comandos de pruebas y compilación están en los `package.json`; ejecútalos cuando el responsable del proyecto lo solicite.

## Preparación de publicación

`prismo/` produce archivos estáticos en `dist/` y requiere que el hosting resuelva las rutas de la SPA hacia `index.html`. `prismo-api/wrangler.jsonc` prepara un Worker independiente. Antes de publicar hay que fijar los dos orígenes, definir `VITE_API_BASE_URL` y `FRONTEND_ORIGIN`, cargar `INEGI_TOKEN` como secreto del Worker y revisar la paginación y tipografías del PDF. Una variable `VITE_*` es pública en el bundle. El frontend no debe llamar directamente a INEGI con el token.

## Límites conocidos

- La voz sigue marcada como **Próximamente**.
- Tres de las diez categorías visibles aún no tienen indicador habilitado.
- Los reportes se guardan por navegador, sin cuenta ni sincronización.
- La caché de Banco Mundial del Worker es temporal y local a cada instancia.
- La paginación visual del editor y la del PDF pueden diferir. Ver [detalle de exportación](../prismo/docs/PDF_EXPORT.md).
