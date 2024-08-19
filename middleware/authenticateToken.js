const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrahiere das Token

  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ungültiges Token' });
    }

    req.user = user; // Speichere die Benutzerdaten aus dem Token in req.user
    next();
  });
};

module.exports = authenticateToken;
