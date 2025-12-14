const mongoose = require('mongoose');
const config = require('./config');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB at ${config.mongoUri}`);
  } catch (err) {
    console.warn('MongoDB connection failed; continuing with in-memory fallback.', err.message);
  }
}

module.exports = { connectDB };

