const screenshotService = require('../services/screenshotService');
const alertService = require('../services/alertService');

async function analyzeScreenshot(req, res, next) {
  try {
    const payload = req.body || {};
    const results = screenshotService.analyzeScreenshot(payload);

    if (payload.createAlert && req.user?.id) {
     const severity =
  results.label === 'clean' ? 'low' : results.label;

    await alertService.saveAlert(req.user.id, {
      type: 'screenshot',
      title: 'Screenshot analyzer alert',
      severity,
      message: `Screenshot flagged as ${severity}`,
      metadata: results,
    });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeScreenshot };

