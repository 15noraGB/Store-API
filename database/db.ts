import { Pool } from 'pg';
import 'dotenv/config';

// Render y Supabase requieren SSL para conectar de forma segura
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para que Render no rechace el certificado de Supabase
  }
});