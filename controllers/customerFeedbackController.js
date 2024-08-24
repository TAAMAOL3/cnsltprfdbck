const db = require('../config/db');
const LinkGenerator = require('../src/linkGenerator');

// Function to create a new customer feedback request
exports.createCustomerFeedback = (req, res) => {
  const { customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, customerFdbckUrlID, usersFK } = req.body;

  const query = `
    INSERT INTO t_customerfdbck (customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckText, customerFdbckReceived, customerFdbckUrl, customerFdbckUrlID, customerFdbckAnswered, usersFK)
    VALUES (?, ?, ?, ?, NULL, NULL, ?, ?, 0, ?)
  `;

  const values = [customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, customerFdbckUrlID, usersFK];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting customer feedback:', err);
      return res.status(500).send('Error creating customer feedback');
    }
    res.status(201).send('Customer feedback successfully created');
  });
};


// Function to get user-specific feedback requests
exports.getUserFeedbackRequests = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT * FROM t_customerfdbck
    WHERE usersFK = ? AND customerFdbckAnswered = 0
    ORDER BY customerFdbckSend desc
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user feedback requests:', err);
      return res.status(500).send('Error fetching feedback requests');
    }
    res.status(200).json(results);
  });
};

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

// Function to update the customer feedback text, status, and rating
exports.updateCustomerFeedbackText = (req, res) => {
  const { id } = req.params;
  const { customerFdbckText, customerFdbckReceived, customerFdbckAnswered, rating } = req.body;  // Include rating

  const query = `
    UPDATE t_customerfdbck
    SET customerFdbckText = ?, customerFdbckReceived = ?, customerFdbckAnswered = ?, rating = ?
    WHERE customerFdbckUrlID = ?
  `;

  db.query(query, [customerFdbckText, customerFdbckReceived, customerFdbckAnswered, rating, id], (err, result) => {
    if (err) {
      console.error('Error updating customer feedback text:', err);
      return res.status(500).send('Error updating feedback');
    }

    res.status(200).send('Customer feedback text and rating updated successfully');
  });
};


// Function to update customer feedback (generic)
exports.updateCustomerFeedback = (req, res) => {
  const { customerCompany, customerName, customerMailaddr } = req.body;
  const feedbackId = req.params.id;

  const query = `
    UPDATE t_customerfdbck
    SET customerCompany = ?, customerName = ?, customerMailaddr = ?
    WHERE customerFdbckID = ?
  `;

  db.query(query, [customerCompany, customerName, customerMailaddr, feedbackId], (err, result) => {
    if (err) {
      console.error('Error updating customer feedback:', err);
      return res.status(500).send('Error updating feedback');
    }
    res.status(200).send('Customer feedback successfully updated');
  });
};

// Function to delete customer feedback
exports.deleteCustomerFeedback = (req, res) => {
  const feedbackId = req.params.id;

  const query = `
    DELETE FROM t_customerfdbck
    WHERE customerFdbckID = ?
  `;

  db.query(query, [feedbackId], (err, result) => {
    if (err) {
      console.error('Error deleting customer feedback:', err);
      return res.status(500).send('Error deleting feedback');
    }
    res.status(200).send('Customer feedback successfully deleted');
  });
};

// customerFeedbackController.js

// Methode zum Abrufen der erhaltenen Feedbacks für einen bestimmten Benutzer
exports.getUserReceivedFeedbacks = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT customerFdbckID, customerFdbckReceived, customerCompany, customerName, customerMailaddr, customerFdbckText, rating
    FROM t_customerfdbck
    WHERE usersFK = ? AND customerFdbckAnswered = 1 ORDER BY customerFdbckReceived desc
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der erhaltenen Feedbacks:', err);
      return res.status(500).send('Fehler beim Abrufen der Feedbacks');
    }
    res.status(200).json(results);
  });
};
