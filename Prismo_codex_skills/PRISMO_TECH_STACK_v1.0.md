# Prismo — Propuesta de Stack Tecnológico y Decisiones de Ingeniería

> Evaluación de origen. La propuesta de Pages Functions y la voz del documento no describen el estado actual: hoy hay un backend separado en `prismo-api/` y la voz aparece como **Próximamente**. Consulta [la arquitectura vigente](../documentation/ARQUITECTURA_Y_OPERACION.md).

**Documento:** STACK-PRISMO-001 · **Versión:** 1.0 · **Fecha:** 12/11/2026  
**Tipo:** recomendación técnica, no implementación aprobada automáticamente.  
**Criterios de selección:** continuidad con React+Vite del autor, tiempo de demo, coste objetivo US$0 (techo de US$10 si resultara indispensable), UX elegante y accesible, APIs oficiales, origen reproducible y escalabilidad evolutiva.

## 1. Recomendación ejecutiva

**React + Vite + TypeScript** para SPA; **Tailwind CSS + shadcn/ui** para componentes accesibles con identidad Prismo; **TanStack Query** para consultas; **Zod** para contratos; **Apache ECharts (SVG)** para gráficas; **Tiptap** para editor; **Dexie/IndexedDB** para borradores locales; **pdfmake** para exportación cliente; **Web Speech API** con fallback por texto; **Cloudflare Pages + Pages Functions** como frontend y backend delgado del mismo origen, con tokens en secretos; **Vitest + Testing Library + Playwright** para pruebas. No LLM, no auth, no DB remota en MVP.

La elección de `pdfmake` y el flujo SVG debe pasar un **spike técnico**; no se da por garantizado que el SVG complejo de todas las gráficas sea aceptado sin normalizarlo.

## 2. Matriz de decisiones y alternativas

| Área | Selección inicial | Por qué conviene | Alternativa / cuándo cambiar |
|---|---|---|---|
| Framework | React SPA | Familiaridad, componentes, productividad | Next.js solo si SEO/SSR/servidor integrado se vuelve crítico |
| Lenguaje | TypeScript estricto | Tipar contratos heterogéneos y evitar errores de esquema | No se recomienda JS puro para adaptadores de datos |
| Build | Vite | Inicio rápido, tooling conocido | Mantener salvo requerimiento nuevo |
| UI | Tailwind CSS v4 + shadcn/ui + Radix en componentes | Control visual y accesibilidad sin inventar controles | CSS Modules si UX se simplifica; evitar dos sistemas a la vez |
| Navegación | React Router (modo declarativo) | Rutas de explorador/editor sin sobrecargar | TanStack Router si se necesita tipado avanzado en URLs |
| Fetch/cache | TanStack Query | Estados de error, caché y refetch | `fetch` puro solo para spike aislado |
| Validación | Zod | Esquemas de respuestas de proveedores/API y formularios | JSON Schema/Ajv si se comparten contratos externos |
| Gráficas | Apache ECharts (SVG por defecto) | Series, interacciones y exportación legible, web/móvil | Recharts si se restringen a muy pocas gráficas |
| Editor | Tiptap, JSON | Edición React con nodos personalizados para gráficas | Lexical si Tiptap impone límites; evitar editor casero |
| Persistencia | Dexie sobre IndexedDB | Guardado local indexado, varios reportes y versiones | DB remota solo para cuentas/sincronización |
| PDF | pdfmake + conversor desde JSON del editor | PDF descargable con texto/tabla/SVG | `react-to-print` como respaldo temporal, no equivalente total al PDF descargable |
| Voz | SpeechRecognition (Web Speech API) | Costo nulo inicial; transcripción editable | Servicio pagado si navegadores objetivo lo requieren |
| Backend | Pages Functions | Protege tokens, normaliza y evita CORS complejo | Worker separado/Hono si API crece |
| Hospedaje | Cloudflare Pages | Sitio estático + funciones y URL gratuita | Vercel/Netlify si despliegue seleccionado falla |
| Tests | Vitest + RTL + Playwright | Unitarias y trayecto real incluyendo móvil | Más suites solo con necesidad |

## 3. Cómo empezar sin sobreingeniería

Proyecto base sugerido:

```bash
npm create vite@latest prismo -- --template react-ts
cd prismo
npm install
npm install react-router @tanstack/react-query zod dexie dexie-react-hooks
npm install echarts @tiptap/react @tiptap/starter-kit pdfmake
npm install tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

Los comandos son **borrador de dependencias para la fase de implementación**, no una garantía de compatibilidad de todas sus versiones. Consultar guías oficiales de shadcn/ui y alias de TypeScript antes de inicializar componentes; instalar módulos gradualmente conforme aparezcan los casos de uso. Para navegador, el reconocimiento de voz puede carecer de implementación o permiso: escribir siempre el camino manual primero.

**Primer compromiso del repositorio:** shell de navegación, paleta aprobada, `PrismoLogo.png`, catálogo de diez categorías en metadatos, un indicador oficial de la categoría 10 y las pantallas vacías/errores. No añadir editores, mapas, LLM ni backend adicional hasta tener una consulta real.

## 4. Tokens visuales obligatorios

```css
:root {
  --prismo-ivory: #F6F1E8;
  --prismo-beige: #E4D7C6;
  --prismo-light-brown: #A78467;
  --prismo-dark-brown: #5C4635;
  --prismo-olive: #68745B;
  --prismo-ink: #2A241F;
}
```

Preferir combinaciones legibles: fondos marfil o blanco cálido, texto tinta y botones café oscuro. Olivo en estados seleccionados cuando pase contraste. Diferenciar colores **de estado** y **series de datos** de los colores decorativos de marca. Los gráficos necesitan leyendas, patrones o etiquetas, fuente, frecuencia, cobertura, unidad, fecha de consulta y fecha de observación. El logo es el isotipo sin texto, sin brillos, sin 3D y sin adornos artificiales.

## 5. Backend mínimo necesario y credenciales

**World Bank API:** no requiere API key. Para la primera consulta se puede hablar directamente con el proveedor si CORS responde; sin embargo, para producción de prototipo público conviene normalizar la respuesta a través de un endpoint mismo origen para que el cliente siempre vea un contrato único.  
**INEGI Indicadores / DENUE:** requieren token; usar `context.env.INEGI_TOKEN` o variables equivalentes **cifradas** en Pages Functions; jamás exponerlas en variables `VITE_*` ni en el bundle.  
**Banxico:** verificar condiciones de token y series antes de integrarlo; usar el mismo patrón seguro de backend.  
**ENIGH:** si la fuente seleccionada no ofrece el tabulado exacto por API, permitir **archivo oficial descargado y versionado** con URL, fecha y transformaciones documentadas; no fingir que se trata de consulta en vivo.

`functions/api/v1/indicators/[id]/observations.ts` es un ejemplo de ruta para la herramienta, cuya sintaxis exacta debe verificarse al implementar Pages Functions. Las respuestas del backend se validan con Zod y usan contrato común de `DatasetSnapshot`.

## 6. Consulta y caché

- **Catálogo local JSON:** categorías, `indicatorId`, indicadores autorizados, filtros, descripciones y fuentes versionadas en Git. Cambios a indicadores requieren revisión del documento de catálogo.
- **TanStack Query:** cachea snapshots por clave `[indicatorId, areas, from, to, catalogVersion]`; `staleTime` dependiente de la frecuencia de la serie; no presentar caché como consulta fresca.
- **Persistencia local:** Dexie para reportes y snapshots congelados; separar `server state` (Query) de `document state` (editor/Dexie).
- **Caché en BFF:** opcional con encabezados correctos y TTL prudente, no ocultar revisiones de proveedor.
- **Errores:** retries acotados, cancelar consultas obsoletas; diferenciar sin datos, tiempo agotado y token ausente.

## 7. Gráficas y PDF: validación de viabilidad requerida

ECharts admite renderizador SVG y `getDataURL`; pdfmake admite nodos SVG, texto, tablas y enlaces. **Eso no implica compatibilidad garantizada de cualquier SVG generado.** El spike debe:

1. Consultar una serie real del Banco Mundial.
2. Renderizar línea/barras con título, leyenda y fuente.
3. Capturar un SVG estático con tipografía/medidas controladas y limpiar elementos no soportados si es necesario.
4. Generar PDF con portada, dos páginas, tabla, fuente y texto acentuado seleccionable.
5. Reabrir el PDF y verificar que los valores coincidan exactamente con el snapshot.
6. Si falla el SVG, probar conversión limitada a PNG de alta resolución **solo del chart**, sin rasterizar texto ni páginas; explicar límites. El PDF no se declara correcto hasta validarlo.

Se recomienda `pdfmake` sobre impresión de navegador para entregar un botón **Descargar PDF** reproducible. El adaptador debe construir el PDF a partir de datos del `ReportDocument`, no del DOM del editor, con renderizado congruente de encabezados, listas, párrafos y `chart`.

## 8. Voz e interpretación de consultas

`SpeechRecognition` puede no estar en todos los navegadores y en algunas implementaciones envía audio a servicios externos. Separar interfaces `SpeechService` (start, stop, callbacks), `QueryParser` (intent, indicador, regiones, periodo) y `DictationController` (texto del editor). El parser del MVP reconoce vocabulario curado con sinónimos y confirmación; no usa IA generativa. La UI siempre permite escribir y corregir.

## 9. Calidad y accesibilidad

- TypeScript `strict`, ESLint y Prettier como convención; evitar `any` en dominio y conexiones.
- Vitest: reglas puras, parser, convertidores PDF, manejo de vacíos.
- Testing Library: estados de búsqueda, voz no soportada, accesibilidad de formularios.
- Playwright: happy-path, editor autosave y PDF, 360 px/768 px/1280 px; simular proveedor caído y respuestas faltantes.
- Verificaciones: contrastes WCAG 2.2 AA, focus y keyboard, tablas alternativas, fuente visible, PDF sin referencias ausentes.
- Documentación: cada indicador nuevo viene con fixtures legítimos, pruebas y ficha de procedencia.

## 10. Presupuesto, costo y dependencia de servicios (noviembre 2026)

| Recurso | Costo inicial previsto | Precaución |
|---|---|---|
| React, Vite, TS, UI, ECharts, Tiptap y pdfmake open source | US$0 en npm | Revisar extensiones de pago y licencias concretas antes de añadirlas |
| World Bank API V2 | Sin API key | Respetar términos por dataset, atribución, uso razonable |
| INEGI / DENUE | Registro y token, sin gasto estimado para la demo | Verificar condiciones y disponibilidad de cada endpoint |
| Cloudflare Pages/Functions | Plan gratuito para demo pequeña | Workers Free reporta 100,000 requests/día con 10 ms CPU/request a 29/oct/2026; límites pueden cambiar |
| Dexie + PDF en navegador | US$0 de base de datos/servidor | Restricciones de almacenamiento local y navegador |
| Voz Web Speech API | Sin contratar servicio propio inicialmente | Compatibilidad parcial y tratamiento de audio externo |

**Presupuesto objetivo:** US$0; reservar hasta US$10 únicamente si una prueba de compatibilidad o deployment específico lo justifica y el autor lo aprueba. No poner tarjeta ni activar planes de pago por defecto.

## 11. Riesgos que justifican un spike antes del desarrollo total

| Riesgo | Señal | Mitigación |
|---|---|---|
| ECharts SVG no embebe correctamente en pdfmake | Gráfica en blanco, ejes cortados | Spike, export PNG solo gráfico como fallback, pruebas PDF |
| INEGI/Banxico devuelven CORS/token/rate limit | Fallos en local o producción | BFF con secretos, fake adapter de pruebas, retry limitado |
| ENIGH no ofrece lo requerido por API | Categoría sin consulta real | Curar archivo/tables oficiales con trazabilidad, no inventar endpoint |
| No hay dato publicado del año actual | Años ausentes | Mostrar último periodo oficial y fecha de consulta por separado |
| Borrador se pierde al limpiar navegador | Usuario pierde trabajo | Aviso claro, backup JSON opcional, futura sincronización |
| Modelo Tiptap/PDF se desvía | Se pierde tabla o formato | Tests de equivalencia de nodos y PDF completo |
| Reconocimiento de voz falla en iOS o Firefox | Micrófono no responde | Fallback teclado explícito y prueba móvil |
| V1 de diez categorías es demasiado trabajo | Mucha integración inconclusa | Corte vertical 0 primero, luego una consulta oficial por categoría |

## 12. Orden de tareas sugeridas a Codex

1. Configurar proyecto, documentación y `PrismoLogo`, importar paleta y diseñar shell accesible.
2. Definir tipos `IndicatorDefinition`, `DatasetSnapshot`, `ChartSpec`, `ReportDocument` y Zod con pruebas.
3. Implementar catálogo curado y una consulta real WB vía adaptador.
4. Montar gráfica SVG y tabla con procedencia y controles de filtros.
5. Editor Tiptap + nodo de gráfica + persistencia Dexie.
6. Spike pdfmake (export con referencias, gráfico y texto seleccionable).
7. BFF para token de INEGI, adaptador y validación de comparabilidad.
8. Voz con parser acotado, fallback manual, pruebas E2E.
9. Activar y probar las diez categorías, una por una; pulir estado de error y móvil.

## 13. Referencias oficiales verificadas el 12/11/2026

- Vite: https://vite.dev/guide/
- Tailwind + Vite: https://tailwindcss.com/docs/installation/using-vite
- shadcn/ui + Vite: https://ui.shadcn.com/docs/installation/vite
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
- ECharts SVG: https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/
- Tiptap React: https://tiptap.dev/docs/editor/getting-started/install/react
- Dexie React: https://dexie.org/docs/Tutorial/React
- pdfmake SVG: https://pdfmake.github.io/docs/document-definition-object/svgs/
- Playwright: https://playwright.dev/docs/intro
- Cloudflare Pages bindings y secretos: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Workers límites: https://developers.cloudflare.com/workers/platform/limits/
- World Bank API: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- INEGI: https://www.inegi.org.mx/servicios/api-indicadores/
- INEGI DENUE: https://www.inegi.org.mx/servicios/api-denue/
- Banxico: https://www.banxico.org.mx/SieAPIRest/swagger/index.html

**No se abordarán dominio y disponibilidad legal de Prismo en esta fase.**
