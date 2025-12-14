const fakeProfileService = require('../services/fakeProfileService');
const alertService = require('../services/alertService');

async function detectFakeProfile(req, res, next) {
  try {
    const payload = req.body || {};
    const results = fakeProfileService.findSimilarFaces(payload);

    if (payload.createAlert && req.user?.id) {
      await alertService.saveAlert(req.user.id, {
        type: 'fake-profile',
        title: 'Fake profile detection alert',
        severity: results.risk,
        message: `Top similarity score: ${(results.topScore * 100).toFixed(1)}%`,
        metadata: results,
      });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

module.exports = { detectFakeProfile };

