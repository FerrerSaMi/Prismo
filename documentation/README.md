# Documentación de Prismo

Esta carpeta describe **la aplicación implementada**. Los documentos de `Prismo_codex_skills/` conservan los requisitos y propuestas originales; cuando difieren del código actual, esta guía y el código indican el estado vigente. No se ha desplegado el frontend ni la API.

## Por dónde empezar

| Necesidad | Documento |
| --- | --- |
| Recorrer la aplicación como usuario y entender cada paso | [Cómo funciona Prismo](COMO_FUNCIONA.md) |
| Encontrar módulos, contratos, consultas, persistencia y configuración | [Arquitectura y operación](ARQUITECTURA_Y_OPERACION.md) |
| Preparar, ejecutar e interpretar cada prueba automatizada | [Pruebas automatizadas](PRUEBAS_AUTOMATIZADAS.md) |
| Consultar propuestas de IA, voz, estudios con varios indicadores y nuevas APIs | [Propuestas futuras](PROPUESTAS_FUTURAS.md) |
| Decisión de mantener la API separada | [ADR-001](../prismo/docs/ADR-001-backend-separado.md) |
| Alcance y límites de la exportación | [Exportación PDF](../prismo/docs/PDF_EXPORT.md) |
| Distribución y comportamiento del editor | [Interfaz del editor](../prismo/docs/EDITOR_UI_DIRECTION.md) |
| Indicadores y cobertura incorporados | [Catálogo](../prismo/docs/CATALOG_EXPANSION.md) e [INEGI](../prismo/docs/INEGI_CATEGORIES.md) |

## Estructura del repositorio

- `prismo/`: interfaz React, editor, dashboards, PDF y reportes locales.
- `prismo-api/`: API independiente que consulta Banco Mundial e INEGI.
- `Prismo_codex_skills/`: [guía de trabajo](../Prismo_codex_skills/SKILL.md) y cuatro especificaciones de origen, sin copias duplicadas.
- `documentation/`: explicación del funcionamiento real y guía técnica vigente.

La voz aparece como **Próximamente**. Las diez categorías se muestran, pero solo ocho indicadores de siete categorías están habilitados. Cada nueva fuente o categoría se incorpora después de verificar su definición, unidad, cobertura y respuesta real. Las ideas de IA y ampliación del catálogo están separadas en [Propuestas futuras](PROPUESTAS_FUTURAS.md).
