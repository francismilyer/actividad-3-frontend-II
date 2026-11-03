import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Pool de conexión a MariaDB
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reactvet_db',
  port: 3306,
});

// Verificador de conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado exitosamente a MariaDB (reactvet_db)');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión a Base de Datos:', err.message);
  });

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend ReactVet en línea' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor API corriendo en http://localhost:${PORT}`);
});