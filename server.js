const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const http = require('http');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'API funcionando correctamente' });
});

// Registro
app.post('/api/register', async (req, res) => {
  const { name, email, password, description, sport } = req.body;
  if (!name || !email || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, description, sport) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, description || '', sport || '']
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  console.log('Intento de login:', req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ message: 'Faltan campos' });
  }
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    // No enviar password al frontend
    const { password: _, ...userData } = user;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ user: userData });
  } catch (err) {
    console.error('Error en login:', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
