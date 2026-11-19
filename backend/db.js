
const mysql = require('mysql2');
require('dotenv').config();

const connectionUrl =
    `mysql://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const db = mysql.createConnection(connectionUrl, {
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
    } else {
        console.log('TiDB Database Connected Successfully! ❤️');
    }
});

module.exports = db;
