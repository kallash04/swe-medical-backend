// controllers/authController.js
const AuthService = require('../services/authService');
const { sendSuccess } = require('../utils/helpers');

exports.register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    sendSuccess(res, { user }, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    sendSuccess(res, { user, token });
  } catch (err) {
    next(err);
  }
};
