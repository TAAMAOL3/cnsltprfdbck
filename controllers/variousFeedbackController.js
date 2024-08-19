const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Multer-Konfiguration für Datei-Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('uploadUrl');

// Abrufen aller Feedbacks eines Benutzers
exports.getFeedbackByUser = (req, res) => {
  const userId = req.params.userID;

  const query = `
    SELECT variousFdbckID, variousFdbckReceived, variousFdbckCustomer, variousFdbckDescription, uploadUrl 
    FROM t_variousFdbck WHERE usersFK = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Feedbacks:', err);
      return res.status(500).send('Fehler beim Abrufen der Feedbacks');
    }
    res.json(results);
  });
};

// Erstellen eines neuen Feedbacks
exports.createFeedback = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Fehler beim Hochladen der Datei:', err);
      return res.status(500).send('Fehler beim Hochladen der Datei');
    }

    const { variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: Token fehlt oder ungültig' });
    }

    const userId = req.user.userId;
    let uploadUrl = null;

    if (req.file) {
      const fileName = `feedback_${Date.now()}_${req.file.originalname}`;
      const uploadPath = path.join(process.env.UPLOAD_PATH, fileName);

      try {
        await sharp(req.file.buffer).toFile(uploadPath);
        uploadUrl = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Fehler beim Speichern der Datei:', error);
        return res.status(500).send('Fehler beim Speichern der Datei');
      }
    }

    const query = `
      INSERT INTO t_variousFdbck (variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived, uploadUrl, usersFK)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived, uploadUrl, userId];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Fehler beim Einfügen des Feedbacks in die Datenbank:', err);
        return res.status(500).send('Fehler beim Speichern des Feedbacks');
      }

      res.status(201).send('Feedback erfolgreich hinzugefügt');
    });
  });
};

// Feedback löschen
exports.deleteFeedback = (req, res) => {
  const feedbackID = req.params.feedbackID;

  const query = 'DELETE FROM t_variousFdbck WHERE variousFdbckID = ?';
  db.query(query, [feedbackID], (err, results) => {
    if (err) {
      console.error('Fehler beim Löschen des Feedbacks:', err);
      return res.status(500).send('Fehler beim Löschen des Feedbacks');
    }
    res.send('Feedback erfolgreich gelöscht');
  });
};
