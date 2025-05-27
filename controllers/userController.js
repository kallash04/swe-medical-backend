// controllers/userController.js
const UserService = require('../services/userService');
const { sendSuccess } = require('../utils/helpers');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await UserService.getProfile(req.user.id);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updated = await UserService.updateProfile(req.user.id, req.body);
    sendSuccess(res, { user: updated });
  } catch (err) {
    next(err);
  }
};

exports.listDoctors = async (req, res, next) => {
  try {
    const departmentId = req.query.departmentId || null;
    const doctors = await UserService.listDoctors(req.user.id, departmentId);
    sendSuccess(res, { doctors });
  } catch (err) {
    next(err);
  }
};
