const pool = require('./db');

async function checkDatabase() {
  try {
    // Verificar si la tabla users existe
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tablas en la base de datos:', tables);

    // Verificar la estructura de la tabla users
    const [columns] = await pool.query('DESCRIBE users');
    console.log('Estructura de la tabla users:', columns);

    // Verificar si hay usuarios
    const [users] = await pool.query('SELECT id, name, email FROM users');
    console.log('Usuarios en la base de datos:', users);

    process.exit(0);
  } catch (err) {
    console.error('Error al verificar la base de datos:', err);
    process.exit(1);
  }
}

checkDatabase(); 