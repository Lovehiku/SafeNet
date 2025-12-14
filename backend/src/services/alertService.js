const Alert = require('../models/Alert');
const mongoose = require('mongoose');

const memoryAlerts = [];

function isDbConnected() {
  return Alert.db && Alert.db.readyState === 1;
}

async function saveAlert(userId, payload) {
  // Ensure severity is valid (low, medium, high, critical)
  let severity = payload.severity || payload.level || 'low';
  if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
    // Map invalid severities to 'low'
    severity = 'low';
  }

  // Prepare alert data - use memory storage format by default
  const alertData = {
    userId: userId, // Keep as string for memory storage
    type: payload.type || 'text',
    title: payload.title || 'Alert',
    severity: severity,
    message: payload.message || 'Suspicious activity detected',
    metadata: payload.metadata || payload,
  };

  // Try DB first if connected
  if (isDbConnected()) {
    try {
      // Convert userId to ObjectId for MongoDB
      const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;
      
      const dbAlertData = {
        ...alertData,
        userId: userIdObj,
      };
      
      const saved = await Alert.create(dbAlertData);
      return saved.toObject();
    } catch (dbError) {
      // If DB save fails, fall back to memory storage
      console.warn('DB save failed, using memory storage:', dbError.message);
      // Continue to memory storage below
    }
  }

  // Memory storage (either no DB connection or DB save failed)
  const stored = { 
    ...alertData, 
    id: `mem-${Date.now()}`, 
    createdAt: new Date(),
    _id: `mem-${Date.now()}` // Add _id for consistency
  };
  memoryAlerts.push(stored);
  return stored;
}

async function listAlerts(userId) {
  if (isDbConnected()) {
    return Alert.find({ userId }).sort({ createdAt: -1 }).lean();
  }
  return memoryAlerts.filter((a) => a.userId === userId);
}

async function deleteAlert(userId, alertId) {
  if (isDbConnected()) {
    const res = await Alert.findOneAndDelete({ _id: alertId, userId });
    return Boolean(res);
  }
  const index = memoryAlerts.findIndex((a) => a.id === alertId && a.userId === userId);
  if (index !== -1) {
    memoryAlerts.splice(index, 1);
    return true;
  }
  return false;
}

module.exports = { saveAlert, listAlerts, deleteAlert };

