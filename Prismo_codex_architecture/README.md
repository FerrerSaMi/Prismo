---
name: prismo-tech-stack
description: Selecciona, configura y mantiene las dependencias y herramientas del prototipo Prismo en React, TypeScript, Vite y servicios gratuitos. Úsala cuando se soliciten setup, elección de librerías, comparaciones técnicas, hosting, PDF, voz, testing, compatibilidad o actualización del stack de Prismo.
---

# Skill — Prismo Tech Stack

## Lee estas referencias

- `references/tech-stack.md` — matriz de tecnologías, decisiones y riesgos de compatibilidad.
- `references/system-design.md` — responsabilidades y contratos que no deben romperse.
- `references/product-ux.md` — visión de marca y comportamiento.
- `references/srs.md` — requisitos verificables.

## Método de trabajo

1. Antes de instalar una dependencia, justifica cuál necesidad o RF resuelve y cuál alternativa se descartó.
2. Prioriza librerías gratuitas/open source y el presupuesto inicial US$0; no habilites planes de pago.
3. Parte de React + Vite + TypeScript estricto, con módulos de dominio separados de UI.
4. Usa Tailwind/shadcn/ui solamente si se puede conservar la paleta y accesibilidad aprobadas.
5. Evita instalar cinco herramientas para una tarea: una biblioteca de charts, un editor y un sistema de caché.
6. Si integras INEGI/Banxico/DENUE, coloca tokens en funciones del servidor, no en `VITE_*`.
7. Valida compatibilidad real de Tiptap JSON → pdfmake y ECharts SVG → pdfmake con una prueba integrada ANTES de montar todo el editor.
8. Prueba Web Speech API en navegadores objetivo; fallback por texto en todo momento.
9. Prioriza test unitario y E2E del vertical completo; no declaremos la V1 por la cantidad de pantallas.
10. Si la documentación o versión de librerías cambió, consulta documentación oficial vigente, fija versiones en lockfile y explica la desviación.

## Stack base acordado como propuesta

React + Vite + TypeScript; React Router; Tailwind v4 + shadcn/ui; TanStack Query; Zod; ECharts (SVG); Tiptap; Dexie/IndexedDB; pdfmake; Web Speech API; Cloudflare Pages/Pages Functions; Vitest + Testing Library + Playwright.

## Guardrails

No SSR/Next.js, microservicios, IA, DB de usuarios ni auth obligatoria sin justificativo. No buscar dominio o disponibilidad legal. Los diez temas finales se validan indicador por indicador. Todo dato actual representa la última publicación disponible y muestra fecha de fuente y fecha de consulta separadas.

## Entregables de cada tarea

Lista breve de paquetes a añadir/quitar, archivos afectados, decisión técnica, riesgo a probar, comandos reproducibles, tests y evidencia de que no se filtraron secretos.
