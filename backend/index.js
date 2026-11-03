import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuración de Base de Datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reactvet_db',
  port: 3306,
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado exitosamente a MariaDB (reactvet_db)');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
  });

// ==========================================
// ENDPOINTS: Dashboard (Mínimo 6 secciones)
// ==========================================
app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ total_productos }]] = await pool.query('SELECT COUNT(*) as total_productos FROM productos');
    const [[{ total_pacientes }]] = await pool.query('SELECT COUNT(*) as total_pacientes FROM pacientes');
    const [[{ citas_pendientes }]] = await pool.query("SELECT COUNT(*) as citas_pendientes FROM citas WHERE estado = 'Pendiente'");
    
    res.json({
      totalProductos: total_productos,
      totalPacientes: total_pacientes,
      citasPendientes: citas_pendientes
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ENDPOINTS: Productos (CRUD 1)
// ==========================================
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;
    await pool.query('INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)', 
      [nombre, categoria, precio, stock]);
    res.json({ message: 'Producto creado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/productos/:id', async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;
    await pool.query('UPDATE productos SET nombre=?, categoria=?, precio=?, stock=? WHERE id=?', 
      [nombre, categoria, precio, stock, req.params.id]);
    res.json({ message: 'Producto actualizado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/productos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id=?', [req.params.id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ENDPOINTS: Pacientes (CRUD 2)
// ==========================================
app.get('/api/pacientes', async (req, res) => {
  try {
    // JOIN para traer el nombre del dueño (cliente)
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as dueno_nombre 
      FROM pacientes p 
      LEFT JOIN clientes c ON p.cliente_id = c.id
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const { nombre, especie, raza, cliente_id } = req.body;
    await pool.query('INSERT INTO pacientes (nombre, especie, raza, cliente_id) VALUES (?, ?, ?, ?)', 
      [nombre, especie, raza, cliente_id]);
    res.json({ message: 'Paciente registrado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const { nombre, especie, raza, cliente_id } = req.body;
    await pool.query('UPDATE pacientes SET nombre=?, especie=?, raza=?, cliente_id=? WHERE id=?', 
      [nombre, especie, raza, cliente_id, req.params.id]);
    res.json({ message: 'Paciente actualizado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM pacientes WHERE id=?', [req.params.id]);
    res.json({ message: 'Paciente eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ENDPOINTS: Citas (CRUD 3)
// ==========================================
app.get('/api/citas', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, p.nombre as paciente_nombre 
      FROM citas c 
      LEFT JOIN pacientes p ON c.paciente_id = p.id
      ORDER BY c.fecha ASC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/citas', async (req, res) => {
  try {
    const { paciente_id, fecha, motivo, estado } = req.body;
    await pool.query('INSERT INTO citas (paciente_id, fecha, motivo, estado) VALUES (?, ?, ?, ?)', 
      [paciente_id, fecha, motivo, estado || 'Pendiente']);
    res.json({ message: 'Cita programada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/citas/:id', async (req, res) => {
  try {
    const { paciente_id, fecha, motivo, estado } = req.body;
    await pool.query('UPDATE citas SET paciente_id=?, fecha=?, motivo=?, estado=? WHERE id=?', 
      [paciente_id, fecha, motivo, estado, req.params.id]);
    res.json({ message: 'Cita actualizada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/citas/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM citas WHERE id=?', [req.params.id]);
    res.json({ message: 'Cita cancelada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ENDPOINTS: Clientes (Relacional)
// ==========================================
app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;
    await pool.query('INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)', 
      [nombre, telefono, email]);
    res.json({ message: 'Cliente registrado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;
    await pool.query('UPDATE clientes SET nombre=?, telefono=?, email=? WHERE id=?', 
      [nombre, telefono, email, req.params.id]);
    res.json({ message: 'Cliente actualizado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clientes WHERE id=?', [req.params.id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend API web corriendo en http://localhost:${PORT}`);
});