# Prismo

Aplicación web para investigar con datos oficiales y redactar reportes con evidencia. La fuente de requisitos y decisiones está en [`../Prismo_codex_architecture`](../Prismo_codex_architecture/), especialmente `PRISMO_PRODUCT_UX_v1.2.md`, `PRISMO_SRS_v1.0.md`, `PRISMO_SYSTEM_DESIGN_v1.0.md` y `PRISMO_TECH_STACK_v1.0.md`.

## Estado del corte actual

- Portada de Inicio que explica el producto, permite entrar al espacio de trabajo y acredita a INEGI y Banco Mundial con una franja LogoLoop. Los nombres enlazan a sus fuentes; la animación se pausa al pasar el puntero y se detiene con movimiento reducido.
- Espacio de trabajo responsive con menú izquierdo para Explorar datos, Mis reportes y Ayuda y fuentes. El control inferior lo contrae o expande; el logo regresa a Inicio. En móvil se abre como panel superpuesto.
- Microanimaciones de entrada al cambiar de sección y respuesta a botones y tarjetas, desactivadas cuando el sistema solicita movimiento reducido.
- Listas animadas inspiradas en AnimatedList de React Bits para navegación, categorías, indicadores, vistas, resultados y reportes. Las tarjetas entran al aparecer en pantalla y las listas interactivas permiten moverse con flechas, Inicio y Fin. El catálogo se puede buscar sin acentos y filtrar por disponibilidad; los selectores de países y periodos conservan opciones cerradas.
- Componentes reutilizables adaptados de las referencias HoloCard, CardNav y Stepper: las tarjetas disponibles del catálogo y las cinco tarjetas de vistas reaccionan al puntero; las categorías «Próximamente» permanecen quietas. Los grupos de edición se abren como paneles animados; el progreso avanza al consultar datos y al abrir el reporte. La entrada desde Inicio muestra una transición breve antes de abrir el espacio de trabajo. Todos respetan movimiento reducido.
- Paleta actual: marfil `#F6F0E4`, blanco `#FFFFFF` y carbón `#17191F` en modo claro; grafito `#17191F`, grafito suave `#272B34` y marfil en modo oscuro. El acento es oro `#C9A86A`; el texto sobre oro usa carbón para conservar contraste. El botón de tema guarda la elección en este navegador.
- Logo actualizado con transparencia en navegación, favicon y sello del reporte. Cabeceras fijas al desplazarse; el menú se abre y contrae con un icono de tres líneas sin borde.
- Diez categorías visibles; siete tienen ocho indicadores consultables. El catálogo presenta tema → sección → indicador, con descripción breve y fuente destacada, sin mostrar códigos internos. Banco Mundial: inflación, desempleo, superficie forestal y consumo de energía renovable, con diez países seleccionables. INEGI: unidades económicas, población inmigrante, viviendas con agua entubada y alfabetización juvenil, con México nacional y diez entidades. Las secciones pendientes aparecen con candado como «Próximamente». Países, estados y años se eligen con listas cerradas; los periodos sin observación se muestran como «Sin dato».
- El recorrido tiene tres pasos: consultar y revisar valores con procedencia; diseñar cinco vistas de dashboard (tendencia, comparación, tabla, tarjetas de valor y cambio entre periodos) en un estudio con galería, lienzo e inspector; seleccionar y ordenar cuáles llevar a un reporte nuevo o existente. El estudio permite cambiar títulos, geografías visibles, colores de series, periodo, puntos de la tendencia, etiquetas de comparación, color de cabecera y número de filas. Los colores también admiten un selector hexadecimal.
- El editor Tiptap guarda texto, formato (negrita, cursiva, tachado, cita, listas y separador), alineación izquierda, centro o derecha por párrafo o encabezado, y las vistas seleccionadas con su configuración. La barra de formato se puede ocultar; sus opciones de documento y selección están agrupadas. Cada dashboard tiene controles desplegables por contenido, tipografía y series, alineación propia, un asa para arrastrarlo entre bloques y una esquina para ajustar su anchura. Permite cambiar título, color hexadecimal, fuente, tamaño de letra y altura acotada, o eliminarlo. El botón «+ Dashboard» inserta otra vista junto al cursor. El documento ofrece un sello con el logo de Prismo al pie. Los reportes pueden eliminarse desde «Mis reportes». Cada snapshot se conserva con el borrador en Dexie/IndexedDB; al reabrirlo se recuperan valores y referencias.
- El estudio y el reporte ofrecen Arial, Verdana, Georgia, Times New Roman y Courier New además de las familias anteriores. El documento permite dar fuente, color hexadecimal y tamaño a una selección; el título del reporte y los títulos y subtítulos de dashboards tienen controles propios. El editor muestra hojas y el número de páginas al crecer el contenido. «Mis reportes» y cada dashboard se eliminan manteniendo presionado el control durante 1,2 segundos; un toque breve no borra contenido.
- Componentes adaptados de HoldButton, LatticeLoader y WarmTooltip: confirmación visual de eliminación, carga animada de consultas oficiales visible durante al menos dos segundos y ayudas de formato al pasar el puntero o enfocar con teclado. El estudio usa galería, lienzo e inspector con superficies de trabajo discretas; el documento conserva sus hojas como foco visual.
- Vista previa y exportación PDF local con paginación A4, texto, vistas, valores, referencias enlazadas y logo en el pie. El PDF se genera desde el documento y las instantáneas guardadas, sin enviar el borrador al backend. La [nota de exportación](docs/PDF_EXPORT.md) registra la verificación y sus límites actuales.
- Voz anunciada como «Próximamente». La selección manual de países y años está disponible.
- Contratos de dominio con Zod y pruebas para indicadores, observaciones, snapshots, gráficas y reportes.

La [dirección visual del editor](docs/EDITOR_UI_DIRECTION.md) recoge la referencia compartida y el estado del primer editor.
La [selección de la primera fuente](docs/WORLD_BANK_FIRST_SOURCE.md) documenta el inicio con Banco Mundial y superficie forestal. La [ampliación del catálogo](docs/CATALOG_EXPANSION.md) registra los nuevos indicadores y sus límites.

## Desarrollo local

Requiere Node y npm compatibles con las versiones fijadas en `package-lock.json`.

```bash
npm ci
npm run dev
npm run build
npm run lint
npm test
npm run test:e2e
```

Para consultar datos reales en local, inicia también el backend hermano con `cd ../prismo-api && npm ci && npm run dev`. Vite reenvía `/api/*` a `http://127.0.0.1:8787`. La prueba E2E usa respuestas controladas y puede correr sin acceso al proveedor; la API real se comprobó aparte.

Para repetir la prueba E2E contra el Banco Mundial real, con el backend local encendido, ejecuta `PRISMO_LIVE_WB=1 npm run test:e2e -- --grep 'consulta viva'` en una terminal tipo Bash. En PowerShell usa `$env:PRISMO_LIVE_WB='1'; npm run test:e2e -- --grep 'consulta viva'`.

Para repetir las pruebas vivas de INEGI, configura el secreto en `../prismo-api/.dev.vars`, reinicia el backend y ejecuta `$env:PRISMO_LIVE_INEGI='1'; npm run test:e2e -- --grep 'consulta viva INEGI'` en PowerShell. El archivo local está ignorado por Git; nunca copies el token al frontend.

Para verificar los cinco indicadores incorporados contra sus proveedores reales y recorrer sus dashboards y reportes, con el backend encendido ejecuta `$env:PRISMO_LIVE_MORE='1'; npm run test:e2e -- --grep 'consulta viva ampliada'` en PowerShell. Las pruebas ordinarias usan respuestas controladas para que sean reproducibles.

## Preparación para despliegue

La aplicación es una SPA de Vite y produce archivos estáticos en `dist/`. El backend vive en [`../prismo-api`](../prismo-api/) como proyecto independiente, preparado para Cloudflare Workers. Esta separación responde a la decisión del responsable del proyecto y sustituye la propuesta inicial de Pages Functions dentro del frontend. No se ha desplegado ninguno de los dos.

En desarrollo, el cliente llama rutas relativas `/api/v1/*` y Vite las reenvía al backend local. Para despliegues en orígenes distintos, configura `VITE_API_BASE_URL` con la URL pública del Worker al compilar el frontend y `FRONTEND_ORIGIN` con el origen exacto del frontend en el Worker. `VITE_API_BASE_URL` contiene solo una URL pública; nunca debe contener tokens. La configuración final de dominio y rutas se decidirá antes del despliegue.

No añadas claves a `src/`, `public/` ni variables con prefijo `VITE_`. El PDF, las gráficas y el editor consumen snapshots normalizados del mismo contrato, sin reconsultar al exportar.
