const express = require('express');
const controller = require('../controllers/analysisController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', auth, controller.analyzeText);

module.exports = router;

