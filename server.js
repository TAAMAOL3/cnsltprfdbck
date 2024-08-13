const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

// Setup database connection
const db = mysql.createConnection({
  host: 'reactappbackend.mysql.database.azure.com',
  user: 'ijzrmfgqx',
  password: 'IxL6keSl4NehCb0Do2Yt',
  database: 'consultprofeedbackdb',
  port: 3306,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'config', 'DigiCertGlobalRootG2.crt.pem'))
  }
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the Azure MySQL database:', err);
    return;
  }
  console.log('Connected to Azure MySQL database!');
});

app.use(express.static(path.join(__dirname, 'build')));

// Store the current random number
let currentRandomNumber = generateRandomNumber();

// Function to generate a random whole number between 1 and 100
function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// GET endpoint to retrieve the current random number
app.get("/", (req, res) => {
  res.json({ randomNumber: currentRandomNumber });
});

// POST endpoint to regenerate a random number
app.post("/regenerate", (req, res) => {
  currentRandomNumber = generateRandomNumber();
  res.json({ randomNumber: currentRandomNumber });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
