// routes/passwordResetRoutes.js
const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

router.post('/request-password-reset', passwordResetController.requestPasswordReset);
router.post('/reset-password', passwordResetController.resetPassword);

module.exports = router;
