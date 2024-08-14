require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const db = require("./config/db");
const registerRoutes = require("./routes/registerRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // Limit jeder IP auf 100 Requests pro 15 Minuten
}));

app.use('/register', registerRoutes);
app.use('/password-reset', passwordResetRoutes);

// Store the current random number
let currentRandomNumber = generateRandomNumber();

// Function to generate a random whole number between 1 and 100
function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// POST endpoint to regenerate a random number
app.post("/regenerate", (req, res) => {
  currentRandomNumber = generateRandomNumber();
  res.json({ randomNumber: currentRandomNumber });
});

// New GET endpoint to fetch data from 't_test' table
app.get("/fetch-test-data", (req, res) => {
  db.query("SELECT * FROM t_test", (error, results, fields) => {
    if (error) {
      res.status(500).send("Error fetching data: " + error.message);
    } else {
      res.json(results);
    }
  });
});

// Registration endpoint
app.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["User", "Leader", "Admin"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Find role ID
      db.query("SELECT id FROM roles WHERE name = ?", [role], (err, results) => {
        if (err || results.length === 0) {
          return res.status(500).json({ error: "Role not found" });
        }

        const roleId = results[0].id;

        // Insert user into the database
        db.query(
          "INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)",
          [email, hashedPassword, roleId],
          (error) => {
            if (error) {
              return res.status(500).json({ error: "Error registering user" });
            }
            res.status(201).json({ message: "User registered successfully" });
          }
        );
      });
    });
  }
);

// Login endpoint
app.post("/login", [body("email").isEmail(), body("password").exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user in the database
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, role: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  });
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://code.jquery.com https://comstrap-cdn.scapp.io; style-src 'self' 'unsafe-inline' https://comstrap-cdn.scapp.io; img-src 'self' data: https:;"
  );
  next();
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
