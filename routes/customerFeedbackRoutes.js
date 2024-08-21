const express = require('express');
const router = express.Router();
const customerFeedbackController = require('../controllers/customerFeedbackController');
const authenticateToken = require('../middleware/authenticateToken');

// Route for creating customer feedback
router.post('/', authenticateToken, customerFeedbackController.createCustomerFeedback);

// Route for fetching user feedback requests
router.get('/user/:id', authenticateToken, customerFeedbackController.getUserFeedbackRequests);

// Route for fetching feedback by URL ID
router.get('/:id', customerFeedbackController.getFeedbackById);

// Route for updating customer feedback text and status
router.put('/text/:id', authenticateToken, customerFeedbackController.updateCustomerFeedbackText);

// Route for updating general customer feedback
router.put('/:id', authenticateToken, customerFeedbackController.updateCustomerFeedback);

// Route for deleting customer feedback
router.delete('/:id', authenticateToken, customerFeedbackController.deleteCustomerFeedback);

// customerFeedbackRoutes.js

// Route zum Abrufen der erhaltenen Feedbacks eines Benutzers
router.get('/userReceived/:id', authenticateToken, customerFeedbackController.getUserReceivedFeedbacks);


module.exports = router;
