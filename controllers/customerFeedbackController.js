const db = require('../config/db'); // Assuming you're using a MySQL database setup
const LinkGenerator = require('../utils/linkGenerator'); // Assuming you have a link generator utility

// Function to create a new customer feedback entry
exports.createCustomerFeedback = (req, res) => {
  const { customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, usersFK } = req.body;

  const query = `
    INSERT INTO t_customerfdbck (customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckText, customerFdbckReceived, customerFdbckUrl, customerFdbckAnswered, usersFK)
    VALUES (?, ?, ?, ?, NULL, NULL, ?, 0, ?)
  `;
  
  const values = [customerCompany, customerName, customerMailaddr, customerFdbckSend, customerFdbckUrl, usersFK];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting customer feedback:', err);
      return res.status(500).send('Error creating customer feedback');
    }
    res.status(201).send('Customer feedback successfully created');
  });
};
