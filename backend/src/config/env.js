import 'dotenv/config'
import path from 'node:path'

// The backend folder (two levels up from src/config)
const backendRoot = path.resolve(import.meta.dirname, '..', '..')

// All settings in one place, read from the .env file.
// The values after || are defaults used if .env is missing.
export const config = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  dbPath: path.resolve(backendRoot, process.env.DB_PATH || 'data/app.db'),
}