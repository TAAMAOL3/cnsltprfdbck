const mysql = require('mysql');

// Erstellen der Datenbankverbindung
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

// Verbindungsaufbau
db.connect(err => {
  if (err) {
    console.error('Fehler beim Verbinden zur Datenbank:', err);
    return;
  }
  console.log('Verbunden mit der Datenbank.');
});

module.exports = db;
