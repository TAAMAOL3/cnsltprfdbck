const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


// Dateitypen, die erlaubt sind (z.B. PNG, JPEG, PDF)
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

// Multer-Konfiguration für Datei-Uploads (Speicherung im Arbeitsspeicher)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Überprüfe, ob der Dateityp zulässig ist
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Ungültiger Dateityp. Erlaubt sind nur PNG, JPEG und PDF'));
    }
  }
}).single('uploadUrl');

// Abrufen aller Feedbacks eines Benutzers
exports.getFeedbackByUser = (req, res) => {
  const userId = req.params.userID;

  const query = `
    SELECT variousFdbckID, variousFdbckReceived, variousFdbckCustomer, variousFdbckDescription, uploadUrl 
    FROM t_variousFdbck WHERE usersFK = ? ORDER BY variousFdbckReceived DESC
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
      console.error('Fehler beim Hochladen der Datei:', err.message);
      return res.status(400).send(err.message); // Klarere Fehlermeldung
    }

    const { variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived } = req.body;

    // Überprüfe, ob der Benutzer authentifiziert ist
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: Token fehlt oder ungültig' });
    }

    const userId = req.user.userId;
    let uploadUrl = null;

    if (req.file) {
      const fileName = `feedback_${Date.now()}_${req.file.originalname}`;
      const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', fileName);
    
      try {
        // Überprüfe den Dateityp und Buffer vor der Verarbeitung
        console.log('Hochgeladene Datei:', req.file.originalname);
        console.log('Dateityp:', req.file.mimetype);
        console.log('Buffer Länge:', req.file.buffer.length);
    
        // Nur unterstützte Bildformate (PNG, JPEG) mit sharp verarbeiten
        if (['image/png', 'image/jpeg'].includes(req.file.mimetype)) {
          await sharp(req.file.buffer).toFile(uploadPath);
        } else {
          // PDF- und andere Dateien direkt speichern, ohne sharp zu verwenden
          await fs.promises.writeFile(uploadPath, req.file.buffer);
        }
        uploadUrl = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Fehler beim Speichern der Datei:', error);
        return res.status(500).send('Fehler beim Speichern der Datei');
      }
    }
    
    
    

    // Datum in das Format yyyy-MM-dd konvertieren
    const formattedDate = new Date(variousFdbckReceived.split('.').reverse().join('-'));

    const query = `
      INSERT INTO t_variousFdbck (variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived, uploadUrl, usersFK)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [variousFdbckCustomer, variousFdbckDescription, formattedDate, uploadUrl, userId];

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


// Aktualisieren eines bestehenden Feedbacks
exports.updateFeedback = (req, res) => {
  const feedbackID = req.params.feedbackID;
  const { variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived } = req.body;

  // Überprüfen, ob das Datum korrekt formatiert ist
  const formattedDate = variousFdbckReceived ? new Date(variousFdbckReceived).toISOString().slice(0, 10) : null;  // Konvertiere ins Format yyyy-MM-dd

  const query = `
    UPDATE t_variousFdbck
    SET variousFdbckCustomer = ?, variousFdbckDescription = ?, variousFdbckReceived = ?
    WHERE variousFdbckID = ?
  `;
  const values = [variousFdbckCustomer, variousFdbckDescription, formattedDate, feedbackID];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Fehler beim Aktualisieren des Feedbacks:', err);
      return res.status(500).send('Fehler beim Aktualisieren des Feedbacks');
    }
    res.status(200).send('Feedback erfolgreich aktualisiert');
  });
};


