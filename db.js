const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: 4000,
    user: 'root',
    password: 'UnRootPasswordMuySeguro123!',
    database: 'sportmatch',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
module.exports = pool;
