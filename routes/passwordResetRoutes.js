const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// Route zur Anforderung eines Passwort-Resets
router.post('/request-password-reset', passwordResetController.requestPasswordReset);

// Route zum Zurücksetzen des Passworts mit Token
router.post('/reset-password', passwordResetController.resetPassword);

// Route zum Senden einer Passwort-Reset-E-Mail
router.post('/send-password-reset-email', passwordResetController.sendPasswordResetEmail);

// Neue Route zum Ändern des Passworts (für NewPassword.js)
router.post('/change-password', passwordResetController.changePassword);

module.exports = router;
