// Archivo de configuración de la base de datos
// En una aplicación real, aquí configuraríamos la conexión a la base de datos

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "sportmatch",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
}

// Esta función sería reemplazada por una conexión real a la base de datos
export const connectToDatabase = async () => {
  console.log("Connecting to database:", dbConfig.database)
  // Código para conectar a la base de datos
  return true
}
