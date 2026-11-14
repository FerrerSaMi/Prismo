---
name: prismo-project
description: Trabajar en Prismo: integrar indicadores oficiales, editar dashboards y reportes, mantener la API separada y actualizar la documentación vigente. Úsala para cambios del proyecto Prismo, no para tareas ajenas al repositorio.
---

# Prismo

Antes de cambiar un flujo, lee [cómo funciona](../documentation/COMO_FUNCIONA.md). Para código, API, contratos o despliegue, consulta [arquitectura y operación](../documentation/ARQUITECTURA_Y_OPERACION.md) y el módulo afectado. Estas guías describen el estado implementado; los cuatro documentos `PRISMO_*.md` de esta carpeta conservan los requisitos y propuestas de origen. Si difieren, aclara la diferencia y sigue las decisiones posteriores del responsable del proyecto.

## Invariantes del producto

- `prismo/` contiene el frontend estático; `prismo-api/` contiene el backend independiente. No coloques el token de INEGI en el navegador ni en `VITE_*`.
- Cada indicador habilitado necesita definición, unidad, cobertura, periodos y procedencia verificables. Muestra faltantes como **Sin dato**. Compara territorios solo dentro del mismo indicador y unidad, con periodos observados en común.
- El reporte guarda el `DatasetSnapshot` que utilizó. Dashboards y PDF consumen esa instantánea; no sustituyen cifras históricas al reabrir o exportar.
- La persona redacta su interpretación. La voz y los indicadores no verificados siguen marcados como **Próximamente**.
- El tema oscuro cubre la interfaz; las hojas de reporte y vistas previas permanecen blancas por legibilidad e impresión. Respeta teclado y movimiento reducido.
- Avanza por indicador o categoría de forma incremental, conforme a la preferencia del responsable del proyecto.

## Referencias de origen

- [Producto y UX](PRISMO_PRODUCT_UX_v1.2.md): visión y requisitos de experiencia originales.
- [SRS](PRISMO_SRS_v1.0.md): requisitos verificables originales.
- [Diseño de sistema](PRISMO_SYSTEM_DESIGN_v1.0.md): separación y contratos propuestos inicialmente.
- [Stack](PRISMO_TECH_STACK_v1.0.md): evaluación inicial de herramientas; su propuesta de Pages Functions fue sustituida por la [decisión de backend separado](../prismo/docs/ADR-001-backend-separado.md).

Al terminar un cambio de comportamiento, actualiza la explicación correspondiente en `documentation/` y, si aplica, la nota histórica de `prismo/docs/`. Ejecuta comprobaciones solo según la instrucción vigente del usuario; no infieras autorización para publicar o desplegar.
