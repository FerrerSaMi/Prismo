# ADR-001: backend en proyecto separado

**Fecha:** 13 de noviembre de 2026  
**Estado:** aceptada para el primer indicador

La arquitectura inicial proponía Pages Functions junto al frontend. El responsable del proyecto pidió que el backend estuviera en otra carpeta distinta de `prismo/` para preparar despliegues independientes. Por ello se creó `prismo-api/` como proyecto hermano.

El frontend Vite produce archivos estáticos y, en desarrollo, reenvía `/api/*` al servidor local del backend. El backend expone un manejador Web Fetch compatible con Cloudflare Workers, sin depender de rutas ni archivos del frontend. Para dos orígenes públicos distintos, el frontend utilizará `VITE_API_BASE_URL` y el Worker permitirá el origen exacto configurado en `FRONTEND_ORIGIN`.

Esta decisión mantiene las credenciales futuras de INEGI exclusivamente en el backend. No se ha desplegado ningún proyecto. Antes de publicar habrá que fijar dominios, variables de entorno y el proceso de despliegue de ambos proyectos.
