const express = require('express');
const router = express.Router();
const teamFeedbackController = require('../controllers/teamFeedbackController');
const authenticateToken = require('../middleware/authenticateToken');

// Route for creating team feedback
router.post('/', authenticateToken, teamFeedbackController.createTeamFeedback);

// Route for fetching team-specific feedback requests (Added :teamId)
router.get('/requests/:teamId', authenticateToken, teamFeedbackController.getTeamFeedbackRequests);

// Route for fetching feedback by URL ID
router.get('/team/:teamId', authenticateToken, teamFeedbackController.getFeedbackByTeam);

// Route for updating team feedback text, status, and rating
router.put('/text/:id', authenticateToken, teamFeedbackController.updateTeamFeedbackText);

// Route for updating general team feedback
router.put('/:id', authenticateToken, teamFeedbackController.updateTeamFeedback);

// Route for deleting team feedback
router.delete('/:id', authenticateToken, teamFeedbackController.deleteTeamFeedback);

// Route for fetching all received feedback for the team
router.get('/received/:teamId', authenticateToken, teamFeedbackController.getTeamReceivedFeedbacks);

module.exports = router;
