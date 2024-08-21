const express = require('express');
const router = express.Router();
const variousFeedbackController = require('../controllers/variousFeedbackController');
const authenticateToken = require('../middleware/authenticateToken');

// Route zum Abrufen von Feedbacks für den angemeldeten Benutzer
router.get('/user/:userID', authenticateToken, variousFeedbackController.getFeedbackByUser);

// Route zum Erstellen eines neuen Feedbacks
router.post('/', authenticateToken, variousFeedbackController.createFeedback);

// Route zum Löschen eines Feedbacks
router.delete('/:feedbackID', authenticateToken, variousFeedbackController.deleteFeedback);

// Route zum Aktualisieren eines Feedbacks
router.put('/:feedbackID', authenticateToken, variousFeedbackController.updateFeedback);


module.exports = router;
