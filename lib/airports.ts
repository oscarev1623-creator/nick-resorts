export interface Airport {
  name: string
  code: string
  region: string
}

export const airports: Airport[] = [
  // MÉXICO
  { name: "Aeropuerto Internacional de la Ciudad de México", code: "MEX", region: "MÉXICO" },
  { name: "Aeropuerto Internacional de Cancún", code: "CUN", region: "MÉXICO" },
  { name: "Aeropuerto Internacional de Guadalajara", code: "GDL", region: "MÉXICO" },
  { name: "Aeropuerto Internacional de Monterrey", code: "MTY", region: "MÉXICO" },
  // CENTROAMÉRICA Y CARIBE
  { name: "Aeropuerto Internacional de Panamá", code: "PTY", region: "CENTROAMÉRICA Y CARIBE" },
  { name: "Aeropuerto Internacional Juan Santamaría, Costa Rica", code: "SJO", region: "CENTROAMÉRICA Y CARIBE" },
  { name: "Aeropuerto Internacional de El Salvador", code: "SAL", region: "CENTROAMÉRICA Y CARIBE" },
  { name: "Aeropuerto Internacional de Santo Domingo, RD", code: "SDQ", region: "CENTROAMÉRICA Y CARIBE" },
  { name: "Aeropuerto Internacional de Puerto Rico", code: "SJU", region: "CENTROAMÉRICA Y CARIBE" },
  // COLOMBIA
  { name: "Aeropuerto Internacional El Dorado, Bogotá", code: "BOG", region: "COLOMBIA" },
  { name: "Aeropuerto Internacional José María Córdova, Medellín", code: "MDE", region: "COLOMBIA" },
  { name: "Aeropuerto Internacional Rafael Núñez, Cartagena", code: "CTG", region: "COLOMBIA" },
  { name: "Aeropuerto Internacional Alfonso Bonilla Aragón, Cali", code: "CLO", region: "COLOMBIA" },
  // VENEZUELA
  { name: "Aeropuerto Internacional Simón Bolívar, Caracas", code: "CCS", region: "VENEZUELA" },
  { name: "Aeropuerto Internacional de Valencia", code: "VLN", region: "VENEZUELA" },
  { name: "Aeropuerto Internacional de Maracaibo", code: "MAR", region: "VENEZUELA" },
  // PERÚ
  { name: "Aeropuerto Internacional Jorge Chávez, Lima", code: "LIM", region: "PERÚ" },
  { name: "Aeropuerto Internacional Rodríguez Ballón, Arequipa", code: "AQP", region: "PERÚ" },
  // ECUADOR
  { name: "Aeropuerto Internacional Mariscal Sucre, Quito", code: "UIO", region: "ECUADOR" },
  { name: "Aeropuerto Internacional José Joaquín de Olmedo, Guayaquil", code: "GYE", region: "ECUADOR" },
  // BOLIVIA
  { name: "Aeropuerto Internacional El Alto, La Paz", code: "LPB", region: "BOLIVIA" },
  { name: "Aeropuerto Internacional Viru Viru, Santa Cruz", code: "VVI", region: "BOLIVIA" },
  // CHILE
  { name: "Aeropuerto Internacional Arturo Merino Benítez, Santiago", code: "SCL", region: "CHILE" },
  // ARGENTINA
  { name: "Aeropuerto Internacional Ministro Pistarini, Buenos Aires", code: "EZE", region: "ARGENTINA" },
  { name: "Aeropuerto Internacional de Córdoba", code: "COR", region: "ARGENTINA" },
  // BRASIL
  { name: "Aeropuerto Internacional de São Paulo", code: "GRU", region: "BRASIL" },
  { name: "Aeropuerto Internacional de Río de Janeiro", code: "GIG", region: "BRASIL" },
  { name: "Aeropuerto Internacional de Brasilia", code: "BSB", region: "BRASIL" },
  // URUGUAY
  { name: "Aeropuerto Internacional de Carrasco, Montevideo", code: "MVD", region: "URUGUAY" },
  // PARAGUAY
  { name: "Aeropuerto Internacional Silvio Pettirossi, Asunción", code: "ASU", region: "PARAGUAY" },
]

export function getAirportsByRegion(region: string): Airport[] {
  return airports.filter((airport) => airport.region === region)
}

export function filterAirports(query: string): Airport[] {
  const lowerQuery = query.toLowerCase()
  return airports.filter(
    (airport) =>
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.code.toLowerCase().includes(lowerQuery)
  )
}
