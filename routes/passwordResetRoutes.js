// routes/passwordResetRoutes.js
const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

router.post('/request-password-reset', passwordResetController.requestPasswordReset);
router.post('/reset-password', passwordResetController.resetPassword);
router.post('/send-password-reset-email', passwordResetController.sendPasswordResetEmail);

module.exports = router;
