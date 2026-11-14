# Prismo API

Backend separado del frontend `../prismo`. Implementa un BFF curado para cuatro indicadores del Banco Mundial (superficie forestal, inflación, desempleo y consumo de energía renovable) y cuatro del INEGI (población inmigrante, viviendas con agua entubada, unidades económicas y alfabetización juvenil). El código de `src/worker.ts` usa Web Fetch y está preparado para Cloudflare Workers; `src/dev-server.ts` lo sirve localmente con Node 24.

## Desarrollo

```bash
npm ci
npm run dev
npm test
npm run typecheck
```

Servidor local: `http://127.0.0.1:8787`. El frontend de Vite reenvía `/api/*` a ese puerto. Prueba de salud: `GET /api/v1/health`. Comparación de dos países: `GET /api/v1/indicators/wb-forest-area-share/observations?geography=MEX%2CBRA&from=2020&to=2024`.

Para INEGI, define `INEGI_TOKEN` en `prismo-api/.dev.vars` (archivo ignorado por Git) y reinicia `npm run dev`. Ejemplo de ruta sin secreto: `GET /api/v1/indicators/inegi-migration-share/observations?geography=00%2C09&from=2010&to=2025`. Los demás IDs son `inegi-water-share`, `inegi-economic-units` y `inegi-youth-literacy`. `00` es el total nacional; el catálogo incluye diez entidades adicionales. El BFF valida indicador, geografía, periodo, unidad y respuesta; nunca envía el token ni una URL que lo contenga al navegador. El enlace de procedencia apunta a la documentación de INEGI y la instantánea conserva los valores consultados.

El backend admite únicamente estos ocho IDs curados y hasta cuatro geografías por consulta. Valida filtros, respuesta del proveedor y datos faltantes. Las muestras del Banco Mundial en `tests/fixtures/` provienen de respuestas públicas reales; las demás respuestas de test son sintéticas y nunca se sirven a usuarios.

Las consultas del Banco Mundial tienen un límite de espera de 18 segundos por intento y un reintento ante fallos transitorios. Cada instancia conserva en memoria respuestas válidas durante 30 minutos; si la fuente falla, puede servir una respuesta de esa misma consulta de hasta 24 horas con `cacheState: "stale"`. Esta memoria es temporal y no se comparte entre instancias del Worker.

## Preparación para desplegar

`wrangler.jsonc` define un Worker independiente. `npx wrangler deploy --dry-run --outdir dist-worker` compila sin publicar. Antes de desplegar, configura `FRONTEND_ORIGIN` con el origen exacto del frontend, compila el frontend con `VITE_API_BASE_URL` apuntando a la URL pública del Worker y carga `INEGI_TOKEN` como secreto del Worker (`npx wrangler secret put INEGI_TOKEN`). No guardes tokens en el código ni en `VITE_*`.

La API no acepta URLs arbitrarias ni funciona como proxy abierto. El PDF y el editor consumirán el snapshot que recibe el frontend, sin volver a consultar al proveedor durante la exportación.
