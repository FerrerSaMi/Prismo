export const COUNTRIES = {
  MEX: { label: 'México', wbCode: 'MX' },
  USA: { label: 'Estados Unidos', wbCode: 'US' },
  CAN: { label: 'Canadá', wbCode: 'CA' },
  BRA: { label: 'Brasil', wbCode: 'BR' },
  ARG: { label: 'Argentina', wbCode: 'AR' },
  CHL: { label: 'Chile', wbCode: 'CL' },
  COL: { label: 'Colombia', wbCode: 'CO' },
  PER: { label: 'Perú', wbCode: 'PE' },
  ESP: { label: 'España', wbCode: 'ES' },
  DEU: { label: 'Alemania', wbCode: 'DE' },
} as const

export type CountryCode = keyof typeof COUNTRIES
export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[]
