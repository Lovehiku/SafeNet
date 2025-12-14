const express = require('express');
const controller = require('../controllers/fakeProfileController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/detect', auth, controller.detectFakeProfile);

module.exports = router;

