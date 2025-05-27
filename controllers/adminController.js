// controllers/adminController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const AuthService = require('../services/authService');
const { sendSuccess } = require('../utils/helpers');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    sendSuccess(res, { users });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // reuse AuthService to hash & save
    const user = await AuthService.register(req.body);
    sendSuccess(res, { user }, 201);
  } catch (err) {
    next(err);
  }
};

exports.listDoctors = async (req, res, next) => {
  try {
    const all = await User.getAll();
    const doctors = all.filter(u => u.role === 'doctor');
    sendSuccess(res, { doctors });
  } catch (err) {
    next(err);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const { email, password, name, department_id } = req.body;
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const doctor = await User.create({
      email,
      password_hash,
      name,
      role: 'doctor',
      profile_photo_url: null,
      department_id
    });
    sendSuccess(res, { doctor }, 201);
  } catch (err) {
    next(err);
  }
};

exports.listUnassigned = async (req, res, next) => {
  try {
    const users = await User.getUnassigned();
    sendSuccess(res, { users });
  } catch (err) {
    next(err);
  }
};

exports.assignDoctor = async (req, res, next) => {
  try {
    const { userId, doctorId } = req.body;
    const updated = await User.assignDoctor(userId, doctorId);
    sendSuccess(res, { user: updated });
  } catch (err) {
    next(err);
  }
};
