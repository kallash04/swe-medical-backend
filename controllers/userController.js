// controllers/userController.js
const UserService = require("../services/userService");
const { sendSuccess } = require("../utils/helpers");
const RecordService = require("../services/recordService");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const SALT_ROUNDS = 10;

exports.getProfile = async (req, res, next) => {
  try {
    const user = await UserService.getProfile(req.user.id);
    // const record = await RecordService.getPatientRecord(req.user.id);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const { userId, newPassword } = req.body;
    const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const updatedUser = await User.changePassword(userId, password_hash);
    sendSuccess(res, { user: updatedUser });
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
