const db = require('../config/db');
const LinkGenerator = require('../src/linkGenerator');




// Function to get feedback by URL ID
exports.getFeedbackById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM t_customerfdbck
    WHERE customerFdbckUrlID = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching feedback by ID:', err);
      return res.status(500).send('Error fetching feedback');
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send('Feedback not found');
    }
  });
};

// Function to update the team feedback text, status, and rating
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
      console.error('Error updating team feedback text:', err);
      return res.status(500).send('Error updating feedback');
    }

    res.status(200).send('Team feedback text and rating updated successfully');
  });
};

// Function to update team feedback (generic)
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
      console.error('Error updating team feedback:', err);
      return res.status(500).send('Error updating feedback');
    }
    res.status(200).send('Team feedback successfully updated');
  });
};

// Function to delete team feedback
exports.deleteTeamFeedback = (req, res) => {
  const feedbackId = req.params.id;

  const query = `
    DELETE FROM t_customerfdbck
    WHERE customerFdbckID = ?
  `;

  db.query(query, [feedbackId], (err, result) => {
    if (err) {
      console.error('Error deleting team feedback:', err);
      return res.status(500).send('Error deleting feedback');
    }
    res.status(200).send('Team feedback successfully deleted');
  });
};

// Function to create a new team feedback request (still using t_customerfdbck)
exports.createTeamFeedback = (req, res) => {
  const { customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, customerFdbckUrlID, usersFK } = req.body;
  const query = `
    INSERT INTO t_customerfdbck (customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckText, customerFdbckReceived, customerFdbckUrl, customerFdbckUrlID, customerFdbckAnswered, usersFK)
    VALUES (?, ?, ?, ?, NULL, NULL, ?, ?, 0, ?)
  `;
  const values = [customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, customerFdbckUrlID, usersFK];

  console.log("Executing SQL Query:", query);
  console.log("With Values:", values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting team feedback:', err);
      return res.status(500).send('Error creating team feedback');
    }
    res.status(201).send('Team feedback successfully created');
  });
};

// Function to get feedback requests for a specific team
exports.getTeamFeedbackRequests = (req, res) => {
  const { teamId } = req.params; // Ensure teamId is properly extracted

  if (!teamId) {
    return res.status(400).send('teamId is required');
  }

  const query = `
    SELECT *
    FROM t_customerfdbck
    WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK = ?) AND customerFdbckAnswered = 0
  `;

  console.log("Executing SQL Query:", query);
  console.log("With teamId:", teamId);

  db.query(query, [teamId], (err, results) => {
    if (err) {
      console.error('Error fetching received feedback for team:', err);
      return res.status(500).send('Error fetching feedback');
    }
    res.status(200).json(results);
  });
};

exports.getTeamReceivedFeedbacks = (req, res) => {
  const { teamId } = req.params; // Ensure teamId is properly extracted

  if (!teamId) {
    return res.status(400).send('teamId is required');
  }

  const query = `
    SELECT customerFdbckID, customerFdbckReceived, customerCompany, customerName, customerMailaddr, customerFdbckText, rating
    FROM t_customerfdbck
    WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK = ?) AND customerFdbckAnswered = 1
  `;

  console.log("Executing SQL Query:", query);
  console.log("With teamId:", teamId);

  db.query(query, [teamId], (err, results) => {
    if (err) {
      console.error('Error fetching received feedback for team:', err);
      return res.status(500).send('Error fetching feedback');
    }
    res.status(200).json(results);
  });
};

exports.getFeedbackByTeam = (req, res) => {
  const { teamId } = req.params; // Ensure teamId is properly extracted

  const query = `
    SELECT variousFdbckID, variousFdbckReceived, variousFdbckCustomer, variousFdbckDescription, uploadUrl 
    FROM t_variousFdbck WHERE usersFK IN (SELECT usersID FROM t_users WHERE teamFK = ?)
  `;
  db.query(query, [teamId], (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Feedbacks:', err);
      return res.status(500).send('Fehler beim Abrufen der Feedbacks');
    }
    res.json(results);
  });
};

