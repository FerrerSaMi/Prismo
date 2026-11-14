export const COUNTRIES = {
  MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', BRA: 'Brasil',
  ARG: 'Argentina', CHL: 'Chile', COL: 'Colombia', PER: 'Perú',
  ESP: 'España', DEU: 'Alemania',
} as const

export type CountryCode = keyof typeof COUNTRIES
export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[]

export function countryName(code: string): string {
  return COUNTRIES[code as CountryCode] ?? INEGI_AREAS[code as keyof typeof INEGI_AREAS] ?? code
}

export const INEGI_AREAS = {
  '00': 'México (nacional)', '01': 'Aguascalientes', '05': 'Coahuila', '07': 'Chiapas', '09': 'Ciudad de México',
  '11': 'Guanajuato', '14': 'Jalisco', '15': 'Estado de México', '19': 'Nuevo León', '21': 'Puebla', '30': 'Veracruz',
} as const
