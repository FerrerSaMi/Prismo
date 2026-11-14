# Prismo · frontend

Aplicación React para consultar indicadores oficiales, diseñar dashboards y escribir reportes con sus fuentes. La explicación del producto está en [Cómo funciona Prismo](../documentation/COMO_FUNCIONA.md); los módulos, contratos y despliegue se explican en [Arquitectura y operación](../documentation/ARQUITECTURA_Y_OPERACION.md).

## Estado actual

- Portada, catálogo de diez categorías, menú lateral plegable y tema claro u oscuro. Ocho indicadores de siete categorías permiten consultar datos; las tarjetas restantes indican **Próximamente**.
- Cuatro indicadores del Banco Mundial para diez países y cuatro de INEGI para México nacional y diez entidades. Los filtros usan listas cerradas y la consulta muestra valores, faltantes y procedencia.
- Cinco vistas configurables: tendencia, comparación, tarjetas de valor, cambio entre periodos y tabla. Se eligen y ordenan antes de crear o ampliar un reporte.
- Editor Tiptap con dashboards dentro del documento, formato de texto, panel de herramientas a la derecha que acompaña el desplazamiento, hojas, guardado local con Dexie/IndexedDB, vista previa y descarga PDF.
- La voz aparece como **Próximamente**. No hay redacción automática, cuentas ni sincronización entre navegadores.

La hoja y la vista previa del dashboard son blancas en ambos temas para conservar la lectura de documento. La interfaz usa marfil `#F6F0E4`, grafito `#17191F`, tarjeta oscura `#272B34` y acento oro `#C9A86A`. Las animaciones respetan la preferencia de movimiento reducido.

## Desarrollo local

Instala dependencias con `npm ci`. En dos terminales, inicia primero la [API separada](../prismo-api/README.md) y después el frontend:

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

Vite reenvía `/api/*` a `http://127.0.0.1:8787`. El comando completo de pruebas se ejecuta desde la raíz con `npm test`. Su preparación, alcance y casos están en [Pruebas automatizadas](../documentation/PRUEBAS_AUTOMATIZADAS.md).

## Preparación para despliegue

`npm run build` produce una SPA estática en `dist/`. El backend vive en la carpeta hermana `prismo-api/`, preparado como Worker independiente. Si se publica en otro origen, compila este proyecto con `VITE_API_BASE_URL` apuntando a la URL pública de la API y configura `FRONTEND_ORIGIN` en el Worker. La URL de `VITE_API_BASE_URL` es pública; ninguna variable `VITE_*` debe contener secretos. El hosting del frontend debe enviar las rutas de la SPA a `index.html`. **No se ha desplegado ningún proyecto.**

## Documentos relacionados

- [Índice de documentación](../documentation/README.md)
- [Pruebas automatizadas](../documentation/PRUEBAS_AUTOMATIZADAS.md)
- [API y token de INEGI](../prismo-api/README.md)
- [Decisión de backend separado](docs/ADR-001-backend-separado.md)
- [Exportación PDF](docs/PDF_EXPORT.md)
- [Catálogo ampliado](docs/CATALOG_EXPANSION.md) e [INEGI](docs/INEGI_CATEGORIES.md)
- [Requisitos y propuestas originales](../Prismo_codex_skills/SKILL.md)
