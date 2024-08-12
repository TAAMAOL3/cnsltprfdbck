const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

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
