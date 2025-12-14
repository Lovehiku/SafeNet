const imageService = require('../services/imageService');
const alertService = require('../services/alertService');

async function analyzeImage(req, res, next) {
  try {
    const payload = req.body || {};
    const results = imageService.analyzeImage(payload);

    if (payload.createAlert && req.user?.id) {
      const severity =
  results.overallRisk === 'clean' ? 'low' : results.overallRisk;

await alertService.saveAlert(req.user.id, {
  type: 'image',
  title: 'Image analysis alert',
  severity,
  message: `Detected ${severity} risk in image`,
  metadata: results,
});
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeImage };

