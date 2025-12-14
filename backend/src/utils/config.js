const dotenv = require('dotenv');

dotenv.config();

const config = {
  // Default to 5000 to align with frontend VITE_API_BASE_URL; override with PORT env as needed.
  port: process.env.PORT ||4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/safenet_guardian',
};

module.exports = config;

