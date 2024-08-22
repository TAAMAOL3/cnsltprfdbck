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
const variousFeedbackRoutes = require('./routes/variousFeedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');
const textMiningRoutes = require('./routes/textMiningRoutes');
const customerFeedbackRoutes = require('./routes/customerFeedbackRoutes');
const teamFeedbackRoutes = require('./routes/teamFeedbackRoutes'); // Import teamFeedbackRoutes

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

app.use('/api/register', registerRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/feedback', variousFeedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', textMiningRoutes);
app.use('/api/customerFeedback', customerFeedbackRoutes);
app.use('/api/team', teamFeedbackRoutes); // Use team feedback routes

// Serve the uploads directory as static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// New /api/user endpoint to get user information based on token
app.get("/api/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch the user information from the database
    db.query("SELECT * FROM t_users WHERE usersID = ?", [decoded.userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];
      res.json({ user: { 
        id: user.usersID, 
        email: user.usersEmail, 
        role: user.rolesFK, 
        vorname: user.usersVorname, 
        nachname: user.usersNachname, 
        teamId: user.teamFK
      }});
    });
  });
});

// Login endpoint
app.post("/api/login", [body("email").isEmail(), body("password").exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user in the database
  db.query("SELECT * FROM t_users WHERE usersEmail = ?", [email], async (err, results) => {
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
    const token = jwt.sign({ userId: user.usersID, role: user.rolesFK }, process.env.JWT_SECRET, {
      expiresIn: '1h',
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

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Successfully logged out' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
