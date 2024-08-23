const express = require('express');
const router = express.Router();
const teamFeedbackController = require('../controllers/teamFeedbackController'); // Stelle sicher, dass der Controller korrekt importiert wird
const authenticateToken = require('../middleware/authenticateToken'); // Authentifizierungs-Middleware

// Route zum Abrufen der Feedback-Anfragen für ein spezifisches Team
router.get('/requests/:teamId/:userId?', authenticateToken, teamFeedbackController.getTeamFeedbackRequests);

// Route zum Abrufen des erhaltenen Feedbacks für ein spezifisches Team
router.get('/received/:teamId/:userId?', authenticateToken, teamFeedbackController.getTeamReceivedFeedbacks);

// Route zum Abrufen des erstellten Feedbacks für ein spezifisches Team
router.get('/feedback/:teamId/:userId?', authenticateToken, teamFeedbackController.getTeamFeedback);

// Route zum Erstellen eines neuen Team-Feedbacks
router.post('/', authenticateToken, teamFeedbackController.createTeamFeedback);

// Route zum Aktualisieren von Team-Feedback (Text, Status und Bewertung)
router.put('/text/:id', authenticateToken, teamFeedbackController.updateTeamFeedbackText);

// Route zum allgemeinen Aktualisieren von Team-Feedback (Kundendetails)
router.put('/:id', authenticateToken, teamFeedbackController.updateTeamFeedback);

// Route zum Löschen eines Team-Feedbacks
router.delete('/:id', authenticateToken, teamFeedbackController.deleteTeamFeedback);



module.exports = router;
