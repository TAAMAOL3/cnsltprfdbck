const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route to get the profile data of a user
router.get('/:id', profileController.getProfile);

// Route to update the profile data of a user
router.put('/:id', profileController.updateProfile); // Ensure updateProfile is defined

module.exports = router;
