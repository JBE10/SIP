// test-mysql.js
const pool = require('./db');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Conexión exitosa:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error de conexión:', err);
    process.exit(1);
  }
}

testConnection();