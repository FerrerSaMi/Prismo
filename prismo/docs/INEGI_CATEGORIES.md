# Primera integración INEGI

Verificación de consulta: 13/11/2026. Fuente: [API del Banco de Indicadores de INEGI](https://www.inegi.org.mx/servicios/api-indicadores/).

| Categoría | Indicador | ID oficial | Unidad devuelta | Cobertura habilitada |
| --- | --- | --- | --- | --- |
| CAT-07 Población | Porcentaje de población inmigrante (migración reciente) | `3104003001` | Porcentaje (`UNIT=3`) | México nacional y diez entidades |
| CAT-08 Vivienda | Porcentaje de viviendas con agua entubada | `3114005001` | Porcentaje (`UNIT=3`) | México nacional y diez entidades |
| CAT-06 Empresas | Unidades económicas del sector privado y paraestatal | `5300000001` | Unidades económicas (`UNIT=104`) | México nacional y diez entidades |
| CAT-09 Educación | Tasa de alfabetización de personas de 15 a 24 años | `1002000050` | Tasa (`UNIT=128`), presentada como porcentaje | México nacional y diez entidades |

Se probaron consultas reales para `00`, `01`, `05`, `07`, `09`, `11`, `14`, `15`, `19`, `21` y `30` en ambos indicadores. El filtro del prototipo ofrece 2010, 2015, 2020 y 2025 como extremos del rango; no todos los años tienen observación. Los periodos ausentes permanecen como «Sin dato». La comparación solo se activa cuando las geografías comparten observaciones; no se mezclan unidades ni indicadores en una misma vista.

Los indicadores de empresas y educación se verificaron también en esas once geografías. Empresas ofrece 2013–2018 y solo 2018 es común para la comparación predeterminada de México nacional con Ciudad de México. Es un conteo de establecimientos, no de empresas creadas. Educación conserva la etiqueta de tasa que devuelve INEGI y la escala porcentual de la serie; se refiere únicamente a personas de 15 a 24 años.

`CL_INDICATOR` devuelve la ficha del indicador; el BFF consulta valores mediante `INDICATOR`. El token permanece en el backend. El enlace público de procedencia lleva a la documentación de la API porque la URL cruda de respuesta incluiría el secreto. El reporte guarda la instantánea y la fecha de consulta.
