const express = require('express');
const router = express.Router();
const customerFeedbackController = require('../controllers/customerFeedbackController');
const authenticateToken = require('../middleware/authenticateToken'); // Assuming you have a JWT middleware for authentication

// Route for handling feedback submissions
router.post('/', authenticateToken, customerFeedbackController.createCustomerFeedback);

module.exports = router;
