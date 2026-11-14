# Pruebas automatizadas de Prismo

Este documento distingue lo que comprueba la suite local de las consultas reales a proveedores. **El comando de la raíz `npm test` ejecuta la suite local completa** en orden y se detiene ante el primer fallo. No se ejecutó al preparar esta guía.

## Preparación y comandos

Requiere Node 24 o superior. Desde la raíz del repositorio, instala las dependencias de ambos proyectos y el Chromium que usa Playwright:

```powershell
npm --prefix prismo ci
npm --prefix prismo-api ci
npm --prefix prismo exec -- playwright install chromium
npm test
```

El último comando realiza, en este orden: lint del frontend, compilación y comprobación TypeScript del frontend, pruebas unitarias del frontend, comprobación TypeScript de la API, pruebas de la API y pruebas de navegador locales. El servidor Vite de las pruebas se inicia automáticamente en `127.0.0.1:4175` y se detiene al terminar. Ese puerto debe estar libre. Las pruebas de navegador usan Chromium instalado por Playwright, no Edge del sistema. Las pruebas locales sustituyen las respuestas HTTP de proveedores por datos controlados; no necesitan `INEGI_TOKEN` ni acceso a internet una vez instaladas las dependencias y el navegador.

Para ejecutar un nivel aislado:

```powershell
npm --prefix prismo run test
npm --prefix prismo-api run test
npm --prefix prismo run test:e2e
```

`npm test` en `prismo/` o `prismo-api/` solo ejecuta las pruebas de ese proyecto. Usa `npm test` **en la raíz** para cubrir ambos. La compilación y el lint son puertas del comando completo aunque no sean archivos de prueba.

## Contratos y lógica del frontend (Vitest)

| Archivo | Casos y resultado que comprueban |
| --- | --- |
| `src/domain/contracts.test.ts` | Acepta indicadores de categorías curadas y rechaza categorías ajenas; distingue cero de `null`; permite fecha de publicación ausente; exige procedencia segura y selección reproducible; valida versión y JSON estructurado del reporte. |
| `src/features/explorer/forestApi.test.ts` | Construye la petición al BFF y valida el snapshot; conserva errores declarados por la API; rechaza snapshots inválidos y distingue fallos de conexión. |
| `src/features/explorer/forestAnalysis.test.ts` | Ofrece para comparación solo periodos con valor para todos los territorios seleccionados. |
| `src/features/explorer/dashboardConfig.test.ts` | Conserva territorios, periodos, título, estilo y color de tabla en `ChartSpec`; rechaza colores hexadecimales inválidos. |
| `src/components/AnimatedSelect.test.tsx` | Abre el menú animado, elige una opción y actualiza el selector; abre hacia arriba con altura limitada cuando el control está cerca del borde inferior. |
| `src/components/ColorMenu.test.tsx` | Reúne paleta y entrada hexadecimal en el mismo control y aplica ambos modos de elección. |

## API separada (Node Test Runner)

| Archivo | Casos y resultado que comprueban |
| --- | --- |
| `src/worker.test.ts` | Normaliza un cero real y un dato ausente; admite los tres indicadores adicionales del Banco Mundial; procesa dos respuestas públicas guardadas como fixtures (México y México/Brasil); rechaza país, ruta o filtros fuera del catálogo; rechaza indicador equivocado y paginación incompleta; oculta detalles internos de errores de red; reintenta un fallo transitorio una vez; reutiliza una consulta válida en caché; aplica `FRONTEND_ORIGIN` a CORS. |
| `src/inegi.test.ts` | Normaliza migración nacional y estatal sin exponer el token; valida el ID de vivienda y rechaza una respuesta incompatible; rechaza geografía inválida y ausencia del secreto; conserva conteos de empresas y comprueba la unidad de alfabetización juvenil. |

Los fixtures del Banco Mundial son respuestas públicas guardadas en `prismo-api/tests/fixtures/`; las demás respuestas de estas pruebas son simuladas. Una prueba con fixture comprueba el adaptador frente a la estructura guardada, no la disponibilidad actual del proveedor.

## Recorridos de navegador locales (Playwright)

Todos los archivos siguientes están en `prismo/tests/e2e/`. Interceptan la ruta `/api/v1/indicators/**` cuando necesitan cifras, para comprobar de forma repetible la interfaz y el paso de datos al reporte.

| Archivo | Qué comprueba cada prueba |
| --- | --- |
| `home-sources.spec.ts` | Créditos animados a INEGI y Banco Mundial en Inicio; adaptación a móvil y preferencia de movimiento reducido. |
| `catalog-ux.spec.ts` | Temas, indicadores, fuente, tarjetas próximas, ausencia de códigos internos y respuesta al hover; búsqueda y filtro por disponibilidad. |
| `forest.spec.ts` | Consulta forestal con tabla, procedencia y cinco vistas; carga visible al menos dos segundos; filtros cerrados y URL de la selección aplicada; comparación desactivada con un solo país; reporte editable y persistente; recuperación tras error de API; edición, movimiento, borrado y reinserción de dashboards; cabecera fija de Inicio; controles de dashboard en móvil; borrado protegido de reportes; arrastre entre bloques; alineación de texto y dashboards que persiste al recargar. |
| `catalog-expansion.spec.ts` | Cinco casos: inflación, desempleo, energía renovable, empresas y educación. En cada uno consulta, muestra cinco vistas, pasa una al reporte y conserva su proveedor; empresas además comprueba un conteo alto y que no haya cambio entre periodos sin datos suficientes. |
| `inegi.spec.ts` | Dos casos: población inmigrante y vivienda con agua. En cada uno consulta entidades, personaliza dashboards y comprueba las referencias del reporte; un tercer caso comprueba que el estudio cabe en móvil. |
| `ui-motion.spec.ts` | Transición de carga al entrar desde Inicio; tarjetas HoloCard y progreso Stepper desde consulta hasta reporte, incluido subrayado solo del paso completado. |
| `theme.spec.ts` | Paleta clara/oscura y persistencia de la elección; botón de menú con tres líneas; lienzo y hoja legibles en modo oscuro; menú y cambio de tema en móvil. |
| `pdf-export.spec.ts` | Formato de texto y título, vista previa, salto de páginas sin texto en la franja entre hojas, sello en la última página, conservación tras recarga y descarga de un archivo con cabecera PDF. |

El test PDF comprueba la cabecera y tamaño del archivo, además de la composición web. No verifica por sí solo la selección de cada palabra en un lector PDF externo ni la fidelidad exacta de todas las fuentes.

## Consultas vivas (ejecución separada)

Los tres archivos `live-*.spec.ts` **se excluyen de `npm test`** porque dependen de internet, disponibilidad de proveedores y configuración del BFF. Para ejecutarlos, inicia `prismo-api/` por separado, configura el token de INEGI en `prismo-api/.dev.vars` si corresponde y habilita las banderas necesarias en la terminal antes de correr el comando. Playwright inicia el frontend en el puerto 4175.

```powershell
cd prismo-api
npm run dev
```

En otra terminal, desde la raíz:

```powershell
$env:PRISMO_LIVE_TESTS='1'
$env:PRISMO_LIVE_WB='1'
$env:PRISMO_LIVE_INEGI='1'
$env:PRISMO_LIVE_MORE='1'
npm --prefix prismo run test:e2e:live
```

| Archivo | Qué consulta en vivo |
| --- | --- |
| `live-forest.spec.ts` | Bosques de México y Brasil hasta la gráfica de comparación. Requiere `PRISMO_LIVE_WB=1`. |
| `live-inegi.spec.ts` | Migración y vivienda, dos recorridos desde INEGI hasta el reporte. Requiere `PRISMO_LIVE_INEGI=1` y `INEGI_TOKEN` en la API. |
| `live-expansion.spec.ts` | Inflación, desempleo, renovables, empresas y educación hasta el reporte. Requiere `PRISMO_LIVE_MORE=1`; los dos casos INEGI también requieren el token. |

Si una bandera no está activa, el caso correspondiente aparece como **omitido**, no como aprobado. Si falla una consulta viva, revisa primero la salud de la API, el token y la respuesta del proveedor antes de atribuir el fallo a la interfaz. No guardes el token en capturas, fixtures ni reportes de Playwright.

## Cómo interpretar el resultado y ampliar cobertura

Un `npm test` satisfactorio significa que pasaron las comprobaciones locales enumeradas, con sus respuestas simuladas y fixtures. No garantiza por sí solo disponibilidad actual de INEGI/Banco Mundial, equivalencia perfecta entre hojas web y PDF, ni ausencia de defectos fuera de los casos escritos. Para una nueva categoría o cambio de contrato, añade un caso al adaptador y al recorrido de navegador correspondiente; si cambia una interacción, actualiza la prueba de ese control y esta tabla. Mantén separados los datos de prueba y las respuestas oficiales vivas.

En esta actualización se organizó y documentó la suite, **sin ejecutarla** por la instrucción vigente del responsable del proyecto.
