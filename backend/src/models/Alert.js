const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['text', 'image', 'screenshot', 'fake-profile'], required: true },
    title: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    message: { type: String, required: true },
    metadata: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);

