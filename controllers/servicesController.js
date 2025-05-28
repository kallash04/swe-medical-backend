// controllers/servicesController.js
const Services = require('../models/Services');
const { sendSuccess } = require('../utils/helpers');

exports.list = async (req, res, next) => {
  try {
    const services = await Services.getAll();
    sendSuccess(res, { services });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Services.getById(id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    sendSuccess(res, { service });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, fee } = req.body;
    const service = await Services.create({ name, fee });
    sendSuccess(res, { service }, 201);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, fee } = req.body;
    const service = await Services.update(id, { name, fee });
    sendSuccess(res, { service });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Services.delete(id);
    sendSuccess(res, {});
  } catch (err) {
    next(err);
  }
};
