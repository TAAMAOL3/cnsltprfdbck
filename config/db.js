const mysql = require('mysql');
const fs = require('fs');

// Erstellen der Konfiguration für die Datenbankverbindung
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
};

// Nur in der Produktionsumgebung wird die SSL-Option hinzugefügt
if (process.env.NODE_ENV === 'production') {
  dbConfig.ssl = { ca: fs.readFileSync(__dirname + '/DigiCertGlobalRootG2.crt.pem') };
}

// Erstellen der Datenbankverbindung
const db = mysql.createConnection(dbConfig);

// Verbindungsaufbau
db.connect(err => {
  if (err) {
    console.error('Fehler beim Verbinden zur Datenbank:', err);
    return;
  }
  console.log('Verbunden mit der Datenbank.');
});

module.exports = db;
