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
const teamFeedbackRoutes = require('./routes/teamFeedbackRoutes'); // Team Feedback Routes
const profileRoutes = require('./routes/profileRoutes'); // Profile Routes
const authenticateToken = require('./middleware/authenticateToken'); // Token authentication middleware

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
}));

// Route imports
app.use('/api/register', registerRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/feedback', variousFeedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', textMiningRoutes);
app.use('/api/customerFeedback', customerFeedbackRoutes);
app.use('/api/team', teamFeedbackRoutes);
app.use('/api/profile', profileRoutes); // Profile Routes

// Serve the uploads directory as static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// User info route to get logged-in user's details
app.get("/api/user", authenticateToken, (req, res) => {
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
      res.json({
        user: {
          id: user.usersID,
          email: user.usersEmail,
          role: user.rolesFK,
          vorname: user.usersVorname,
          nachname: user.usersNachname,
          teamId: user.teamFK
        }
      });
    });
  });
});

// API route to fetch teams
app.get('/api/teams', authenticateToken, (req, res) => {
  const query = 'SELECT teamID, teamName FROM t_team';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching teams' });
    }
    res.status(200).json(results);
  });
});

// API route to fetch users by team
app.get("/api/users/team/:teamId", authenticateToken, (req, res) => {
  const { teamId } = req.params;
  const query = 'SELECT usersID, CONCAT(usersVorname, " ", usersNachname) AS fullName FROM t_users WHERE teamFK = ?';
  db.query(query, [teamId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.status(200).json(results);
  });
});

// Login route
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

// Serve React app from the build folder
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Set content security policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://code.jquery.com https://comstrap-cdn.scapp.io; style-src 'self' 'unsafe-inline' https://comstrap-cdn.scapp.io; img-src 'self' data: https:;"
  );
  next();
});

// Logout route
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Successfully logged out' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
