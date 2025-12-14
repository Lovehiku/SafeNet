const express = require('express');
const controller = require('../controllers/screenshotController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', auth, controller.analyzeScreenshot);

module.exports = router;

