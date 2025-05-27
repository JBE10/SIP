const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia por tu usuario de MySQL
  password: 'UnRootPasswordMuySeguro123!', // Cambia por tu contraseña de MySQL
  database: 'sportmatch', // Cambia si tu base tiene otro nombre
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
