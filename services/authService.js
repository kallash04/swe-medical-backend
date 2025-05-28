// services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class AuthService {
  static async register({ email, password, name }) {
    const existing = await User.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password_hash: hash,
      name,
      role: 'user',
      profile_photo_url: null,
      department_id: null
    });
    return user;
  }

  static async login({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new Error('Invalid credentials');
    }
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    logger.info('User %s logged in', user.id);
    return { user, token };
  }

  static async changeUserPassword({ userId, newPassword }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.update({ id: userId }, { password_hash: hash });
    logger.info('Admin changed password for user %s', userId);
    return { success: true };
  }

}

module.exports = AuthService;
