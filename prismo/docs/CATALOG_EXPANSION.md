# Ampliación del catálogo

Verificación: 13/11/2026. Se habilitaron cinco indicadores adicionales, con consultas reales y recorrido hasta dashboards y reportes.

| Categoría | Indicador | ID del proveedor | Unidad de la serie |
| --- | --- | --- | --- |
| CAT-01 Inflación | [Inflación al consumidor](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG) | `FP.CPI.TOTL.ZG` | Variación anual % |
| CAT-03 Empleo | [Desempleo total, estimación modelada OIT](https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS) | `SL.UEM.TOTL.ZS` | % de la fuerza laboral |
| CAT-10 Medio ambiente | [Consumo de energía renovable](https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS) | `EG.FEC.RNEW.ZS` | % del consumo final de energía |
| CAT-06 Empresas | [Unidades económicas del sector privado y paraestatal](https://www.inegi.org.mx/servicios/api-indicadores/) | `5300000001` | Unidades económicas |
| CAT-09 Educación | [Tasa de alfabetización de 15 a 24 años](https://www.inegi.org.mx/servicios/api-indicadores/) | `1002000050` | Tasa en escala porcentual |

Las series del Banco Mundial se consultan para los diez países ofrecidos en el filtro. INEGI se consulta para México nacional y diez entidades. Una comparación dentro de una vista usa un solo indicador, la misma unidad y un año común. No se imputan valores faltantes. En empresas, 2018 es el único año común observado en la selección predeterminada México–Ciudad de México; la vista de cambio requiere dos periodos observados y puede no estar disponible. El rango de años seleccionable no garantiza que todos los territorios tengan observaciones en cada año.

La integración INEGI usa el token exclusivamente en el BFF separado. La fecha de consulta se guarda en el snapshot del reporte. Estos indicadores amplían el catálogo inicial; las categorías CAT-02, CAT-04 y CAT-05 aún no están activas.
