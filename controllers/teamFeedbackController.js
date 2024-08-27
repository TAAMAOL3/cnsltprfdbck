const db = require('../config/db'); // Import der Datenbankkonfiguration

// Funktion zum Erstellen eines neuen Team-Feedbacks
exports.createTeamFeedback = (req, res) => {
  const { customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, customerFdbckUrlID, usersFK } = req.body;

  const query = `
    INSERT INTO t_customerfdbck (customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckText, customerFdbckReceived, customerFdbckUrl, customerFdbckUrlID, customerFdbckAnswered, usersFK)
    VALUES (?, ?, ?, ?, NULL, NULL, ?, ?, 0, ?)
  `;

  const values = [customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, customerFdbckUrlID, usersFK];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Fehler beim Erstellen des Team-Feedbacks:', err);
      return res.status(500).send('Fehler beim Erstellen des Feedbacks');
    }
    res.status(201).send('Feedback erfolgreich erstellt');
  });
};

// Funktion zum Abrufen des erhaltenen Feedbacks für ein Team und optional für einen Benutzer
exports.getTeamReceivedFeedbacks = (req, res) => {
  let { teamId, userId } = req.params;

  // Wenn teamId "all" ist, konvertiere es zu "%"
  teamId = teamId === 'all' ? '%' : teamId;

  console.log("getTeamReceivedFeedbacks", teamId);

  let query = `
    SELECT customerFdbckID, customerFdbckReceived, customerCompany, customerName, customerMailaddr, customerFdbckText, rating, concat(t_users.usersVorname, ' ', t_users.usersNachname) as usersName
    FROM t_customerfdbck
    LEFT JOIN t_users on t_customerfdbck.usersFK = t_users.usersID
    WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK LIKE ?) AND customerFdbckAnswered = 1
  `;

  if (userId && userId !== 'all') {
    query += ' AND usersFK = ?';
  }

  const params = userId && userId !== 'all' ? [teamId, userId] : [teamId];

  query += ' ORDER BY customerFdbckReceived desc';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen des erhaltenen Feedbacks:', err);
      return res.status(500).send('Fehler beim Abrufen des erhaltenen Feedbacks');
    }
    res.status(200).json(results);
  });
};

// Funktion zum Abrufen des erstellten Feedbacks aus der Tabelle t_variousfdbck
// exports.getTeamFeedback = (req, res) => {
//   let { teamId, userId } = req.params;

//   // Wenn teamId "all" ist, konvertiere es zu "%"
//   teamId = teamId === 'all' ? '%' : teamId;

//   console.log("getTeamFeedback", teamId);

//   let query = `
//     SELECT variousFdbckID, variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived, uploadUrl, usersFK, concat(t_users.usersVorname, ' ', t_users.usersNachname) as usersName
//     FROM t_variousfdbck
//     LEFT JOIN t_users on t_variousfdbck.usersFK = t_users.usersID
//     WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK LIKE ?)
//   `;

//   if (userId && userId !== 'all') {
//     query += ' AND usersFK = ?';
//   }

//   const params = userId && userId !== 'all' ? [teamId, userId] : [teamId];

//   query += ' ORDER BY variousFdbckReceived desc';

//   db.query(query, params, (err, results) => {
//     if (err) {
//       console.error('Fehler beim Abrufen des erstellten Feedbacks:', err);
//       return res.status(500).send('Fehler beim Abrufen des erstellten Feedbacks');
//     }
//     res.status(200).json(results);
//   });
// };

exports.getTeamFeedback = (req, res) => {
  let { teamId, userId } = req.params;

  // Wenn teamId "all" ist, konvertiere es zu "%"
  teamId = teamId === 'all' ? '%' : teamId;

  console.log("getTeamFeedback", teamId);

  // SQL-Abfrage, um Feedback-Daten basierend auf dem Team und optional dem Benutzer zu laden
  let query = `
    SELECT variousFdbckID, variousFdbckCustomer, variousFdbckDescription, variousFdbckReceived, uploadUrl, usersFK, concat(t_users.usersVorname, ' ', t_users.usersNachname) as usersName
    FROM t_variousfdbck
    LEFT JOIN t_users on t_variousfdbck.usersFK = t_users.usersID
    WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK LIKE ?)
  `;

  // Wenn ein bestimmter Benutzer ausgewählt wurde, füge eine zusätzliche Bedingung hinzu
  if (userId && userId !== 'all') {
    query += ' AND usersFK = ?';
  }

  // Bestimme die Parameter für die SQL-Abfrage
  const params = userId && userId !== 'all' ? [teamId, userId] : [teamId];

  query += ' ORDER BY variousFdbckReceived desc';

  // Führe die SQL-Abfrage aus
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen des erstellten Feedbacks:', err);
      return res.status(500).send('Fehler beim Abrufen des erstellten Feedbacks');
    }
    res.status(200).json(results);
  });
};


// Funktion zum Abrufen der Feedback-Anfragen für ein Team
// exports.getTeamFeedbackRequests = (req, res) => {
//   let { teamId, userId } = req.params;

//   // Wenn teamId "all" ist, konvertiere es zu "%"
//   teamId = teamId === 'all' ? '%' : teamId;

//   console.log("getTeamFeedbackRequests", teamId);

//   let query = `
//     SELECT customerFdbckID, customerFdbckSend, customerCompany, customerName, customerMailaddr, customerFdbckText, rating, concat(t_users.usersVorname, ' ', t_users.usersNachname) as usersName
//     FROM t_customerfdbck
//     LEFT JOIN t_users on t_customerfdbck.usersFK = t_users.usersID
//     WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK LIKE ?) AND customerFdbckAnswered = 0
//   `;

//   if (userId && userId !== 'all') {
//     query += ' AND usersFK = ?';
//   }

//   const params = userId && userId !== 'all' ? [teamId, userId] : [teamId];

//   query += ' ORDER BY customerFdbckSend desc';

//   db.query(query, params, (err, results) => {
//     if (err) {
//       console.error('Fehler beim Abrufen der Feedback-Anfragen:', err);
//       return res.status(500).send('Fehler beim Abrufen der Feedback-Anfragen');
//     }
//     res.status(200).json(results);
//   });
// };

// Funktion zum Abrufen der Feedback-Anfragen für ein Team
exports.getTeamFeedbackRequests = (req, res) => {
  let { teamId, userId } = req.params;

  // Wenn teamId "all" ist, konvertiere es zu "%"
  teamId = teamId === 'all' ? '%' : teamId;

  console.log("getTeamFeedbackRequests", teamId);

  // SQL-Abfrage für Feedback-Anfragen
  let query = `
    SELECT customerFdbckID, customerFdbckSend, customerCompany, customerName, customerMailaddr, customerFdbckText, rating, concat(t_users.usersVorname, ' ', t_users.usersNachname) as usersName
    FROM t_customerfdbck
    LEFT JOIN t_users on t_customerfdbck.usersFK = t_users.usersID
    WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK LIKE ?) AND customerFdbckAnswered = 0
  `;

  // Wenn ein bestimmter Benutzer ausgewählt wurde, füge eine zusätzliche Bedingung hinzu
  if (userId && userId !== 'all') {
    query += ' AND usersFK = ?';
  }

  // Bestimme die Parameter für die SQL-Abfrage
  const params = userId && userId !== 'all' ? [teamId, userId] : [teamId];

  // Abfrage ausführen
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Feedback-Anfragen:', err);
      return res.status(500).send('Fehler beim Abrufen der Feedback-Anfragen');
    }

    res.status(200).json(results);
  });
};


// Funktion zum Aktualisieren des Feedbacktexts, Status und Bewertung
exports.updateTeamFeedbackText = (req, res) => {
  const { id } = req.params;
  const { customerFdbckText, customerFdbckReceived, customerFdbckAnswered, rating } = req.body;

  const query = `
    UPDATE t_customerfdbck
    SET customerFdbckText = ?, customerFdbckReceived = ?, customerFdbckAnswered = ?, rating = ?
    WHERE customerFdbckUrlID = ?
  `;

  db.query(query, [customerFdbckText, customerFdbckReceived, customerFdbckAnswered, rating, id], (err, result) => {
    if (err) {
      console.error('Fehler beim Aktualisieren des Team-Feedbacks:', err);
      return res.status(500).send('Fehler beim Aktualisieren des Feedbacks');
    }

    res.status(200).send('Feedback erfolgreich aktualisiert');
  });
};

// Funktion zum allgemeinen Aktualisieren des Feedbacks (Kundendetails)
exports.updateTeamFeedback = (req, res) => {
  const { customerCompany, customerName, customerMailaddr } = req.body;
  const feedbackId = req.params.id;

  const query = `
    UPDATE t_customerfdbck
    SET customerCompany = ?, customerName = ?, customerMailaddr = ?
    WHERE customerFdbckID = ?
  `;

  db.query(query, [customerCompany, customerName, customerMailaddr, feedbackId], (err, result) => {
    if (err) {
      console.error('Fehler beim Aktualisieren der Feedback-Kundendetails:', err);
      return res.status(500).send('Fehler beim Aktualisieren der Kundendetails');
    }
    res.status(200).send('Feedback erfolgreich aktualisiert');
  });
};

// Funktion zum Löschen eines Feedbacks
exports.deleteTeamFeedback = (req, res) => {
  const feedbackId = req.params.id;

  const query = `
    DELETE FROM t_customerfdbck
    WHERE customerFdbckID = ?
  `;

  db.query(query, [feedbackId], (err, result) => {
    if (err) {
      console.error('Fehler beim Löschen des Feedbacks:', err);
      return res.status(500).send('Fehler beim Löschen des Feedbacks');
    }
    res.status(200).send('Feedback erfolgreich gelöscht');
  });
};
