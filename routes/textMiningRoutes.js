const express = require('express');
const router = express.Router();
const { textMining } = require('../controllers/textMiningController');

// Route für das Textmining
router.post('/analyze', textMining);

module.exports = router;
