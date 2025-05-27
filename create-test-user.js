const bcrypt = require('bcryptjs');
const pool = require('./db');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(
      'INSERT INTO users (name, email, password, description, sport) VALUES (?, ?, ?, ?, ?)',
      ['Usuario Prueba', 'test@example.com', hashedPassword, 'Usuario de prueba', 'Fútbol']
    );
    console.log('Usuario de prueba creado exitosamente');
    process.exit(0);
  } catch (err) {
    console.error('Error al crear usuario de prueba:', err);
    process.exit(1);
  }
}

createTestUser(); 