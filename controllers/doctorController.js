// controllers/doctorController.js
const DoctorService = require('../services/doctorService');
const { sendSuccess } = require('../utils/helpers');

exports.getPatients = async (req, res, next) => {
  try {
    const patients = await DoctorService.getAssignedPatients(req.user.id);
    sendSuccess(res, { patients });
  } catch (err) {
    next(err);
  }
};

exports.getPatientRecord = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const record = await DoctorService.getPatientRecord(patientId);
    sendSuccess(res, { record });
  } catch (err) {
    next(err);
  }
};

exports.updatePatientRecord = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const updated = await DoctorService.updatePatientRecord(
      patientId,
      req.body.data,
      req.user.id
    );
    sendSuccess(res, { record: updated });
  } catch (err) {
    next(err);
  }
};

exports.getAvailability = async (req, res, next) => {
  try {
    const blocks = await DoctorService.getAvailability(req.user.id);
    sendSuccess(res, { availability: blocks });
  } catch (err) {
    next(err);
  }
};

exports.setAvailability = async (req, res, next) => {
  try {
    const blocks = await DoctorService.setAvailability(req.user.id, req.body.blocks);
    sendSuccess(res, { availability: blocks });
  } catch (err) {
    next(err);
  }
};

exports.clearAvailability = async (req, res, next) => {
  try {
    const dayOfWeek = parseInt(req.params.dayOfWeek, 10);
    await DoctorService.clearAvailability(req.user.id, dayOfWeek);
    sendSuccess(res, {});
  } catch (err) {
    next(err);
  }
};

exports.getCalendar = async (req, res, next) => {
  try {
    const { monthStart, monthEnd } = req.query;
    const days = await DoctorService.getCalendar(req.user.id, monthStart, monthEnd);
    sendSuccess(res, { days });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const appointments = await DoctorService.getAppointmentsByDate(req.user.id, date);
    sendSuccess(res, { appointments });
  } catch (err) {
    next(err);
  }
};
