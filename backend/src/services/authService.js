const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../utils/config');

// In-memory fallback when MongoDB is not available
const memoryUsers = new Map();

function isDbConnected() {
  return User.db && User.db.readyState === 1;
}

function signToken(user) {
  return jwt.sign(
    { id: user._id?.toString() || user.id, email: user.email, role: user.role || 'user' },
    config.jwtSecret,
    { expiresIn: '12h' }
  );
}

async function register({ email, password, name }) {
  const normalizedEmail = email.toLowerCase();

  if (isDbConnected()) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      const err = new Error('Email already registered');
      err.status = 409;
      throw err;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password: hashed, name });
    const token = signToken(user);
    return { user: { id: user._id, email: user.email, name: user.name }, token };
  }

  if (memoryUsers.has(normalizedEmail)) {
    const err = new Error('Email already registered (memory store)');
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: `mem-${Date.now()}`, email: normalizedEmail, name, password: hashed, role: 'user' };
  memoryUsers.set(normalizedEmail, user);
  const token = signToken(user);
  return { user: { id: user.id, email: user.email, name: user.name }, token };
}

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase();

  if (isDbConnected()) {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const token = signToken(user);
    return { user: { id: user._id, email: user.email, name: user.name }, token };
  }

  const user = memoryUsers.get(normalizedEmail);
  if (!user) {
    const err = new Error('Invalid credentials (memory store)');
    err.status = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid credentials (memory store)');
    err.status = 401;
    throw err;
  }
  const token = signToken(user);
  return { user: { id: user.id, email: user.email, name: user.name }, token };
}

module.exports = { register, login };

