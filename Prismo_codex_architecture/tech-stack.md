---
name: prismo-system-design
description: Diseña, revisa e implementa módulos, contratos de datos, integraciones oficiales, reportes y flujos de Prismo respetando el SRS, trazabilidad, prototipo web y el Enfoque A sin IA generativa. Úsala cuando se pidan arquitectura, APIs, modelos, integración, persistencia, backend o exportación PDF de Prismo.
---

# Skill — Prismo System Design

## Fuentes que debes leer antes de trabajar

1. `references/system-design.md` — decisiones, diagramas, dominios y contratos.
2. `references/product-ux.md` — visión aprobada y estilo de Prismo.
3. `references/srs.md` — requisitos RF/RNF/RB/HU/CU del SRS original.
4. Si existe en el repositorio: `docs/PRISMO_TECH_STACK_v1.0.md` para librerías y hosting.

## Procedimiento

1. Identifica la tarea y los requisitos RF/RB relevantes; cita sus IDs en tu plan o PR.
2. Determina el corte: `vertical-0`, `vertical-1` o `v1`; no expandas el alcance por tu cuenta.
3. Define interfaces y estados de error antes de codificar; agrega validación de respuesta por proveedor.
4. Encapsula consultas oficiales en adapters con catálogo curado; nunca URL proxy arbitraria ni tokens en frontend.
5. Conserva `fetchedAt`, `sourcePublishedAt`, `latestObservationPeriod`, origen, notas, unidad, periodo y territorios.
6. Haz que comparación, gráfica, editor, bibliografía y PDF consuman el mismo snapshot. Nunca reconsultes automáticamente al exportar.
7. Para cambios de esquema de reporte, contempla versión y migración de IndexedDB.
8. Incluye pruebas unitarias (faltantes/incompatibilidad), integración (fallo de API) y E2E del camino de usuario.
9. Documenta decisiones nuevas con ADR de una página cuando cambien un límite de dominio o tecnología.
10. Reporta evidencia verificada (tests, archivos) y puntos pendientes; no afirmes que algo funciona sin comprobarlo.

## Invariantes que no puedes romper

- Los números provienen de fuentes oficiales verificadas, no de mocks mostrados como reales.
- Un valor no publicado es `null`, nunca cero artificial.
- La fecha del día de consulta NO implica que el dato corresponda a hoy.
- No presentar nacional como estatal ni mezclar metodologías/frecuencias/definiciones incompatibles.
- Conservar texto y referencias del autor en fallos de red; los borradores son locales a un navegador.
- Voz opcional y confirmada; todas las acciones clave tienen entrada manual.
- PDF solo se considera completo si preserva fuentes, tablas, gráficas, autoría y valores de snapshots.
- Identidad: Prismo, `PrismoLogo.png`, seis colores aprobados, estilo elegante y moderno.
- No crear módulo de IA generativa, login obligatorio, colaboración o dominio comercial en este corte.

## Salida esperada al implementar

Proporciona: alcance RF/RB, diseño de módulos, contratos TypeScript, cambios de archivos, tests realizados, comportamiento de errores, dependencia de tokens/fixtures, resumen de verificación y siguiente corte pequeño.
