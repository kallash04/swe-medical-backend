// controllers/departmentController.js
const DepartmentService = require('../services/departmentService');
const { sendSuccess } = require('../utils/helpers');

exports.list = async (req, res, next) => {
  try {
    const departments = await DepartmentService.list();
    sendSuccess(res, { departments });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await DepartmentService.get(id);
    sendSuccess(res, { department });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const department = await DepartmentService.create(req.body);
    sendSuccess(res, { department }, 201);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await DepartmentService.update(id, req.body);
    sendSuccess(res, { department });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await DepartmentService.delete(id);
    sendSuccess(res, {});
  } catch (err) {
    next(err);
  }
};
