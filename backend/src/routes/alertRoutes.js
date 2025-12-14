const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', controller.listAlerts);
router.post('/', controller.createAlert);
router.delete('/:id', controller.removeAlert);

router.get('/export-csv', controller.exportCSV);
router.get('/download-bundle', controller.downloadBundle);

module.exports = router;