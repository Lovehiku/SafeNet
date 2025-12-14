const Alert = require('../models/Alert');
const { Parser } = require('json2csv');
const archiver = require('archiver');

// List all alerts
exports.listAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).lean();
    res.json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
};

// Create a new alert
exports.createAlert = async (req, res, next) => {
  try {
    const alert = new Alert({
      userId: req.user.id,
      type: req.body.type,
      title: req.body.title,
      severity: req.body.severity,
      message: req.body.message,
      metadata: req.body.metadata,
    });
    await alert.save();
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
};

// Remove an alert
exports.removeAlert = async (req, res, next) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Alert removed' });
  } catch (err) {
    next(err);
  }
};

// Export alerts as CSV
exports.exportCSV = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).lean();
    const fields = ['_id', 'userId', 'type', 'title', 'severity', 'message', 'metadata', 'createdAt', 'updatedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(alerts);

    res.header('Content-Type', 'text/csv');
    res.attachment('alerts.csv');
    res.send(csv);
  } catch (err) {
    console.error('Error exporting CSV:', err);
    res.status(500).send('Error generating CSV');
  }
};

// Download alerts bundle (ZIP)
exports.downloadBundle = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).lean();

    res.header('Content-Type', 'application/zip');
    res.attachment('alerts_bundle.zip');

    const zip = archiver('zip');
    zip.pipe(res);

    zip.append(JSON.stringify(alerts, null, 2), { name: 'alerts.json' });
    alerts.forEach((alert) => {
      zip.append(JSON.stringify(alert, null, 2), { name: `alert-${alert._id}.json` });
    });

    await zip.finalize();
  } catch (err) {
    console.error('Error creating bundle:', err);
    res.status(500).send('Error generating bundle');
  }
};