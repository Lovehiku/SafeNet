const express = require('express');
const controller = require('../controllers/imageController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', auth, controller.analyzeImage);

module.exports = router;

