// controllers/doctorController.js
const DoctorService = require("../services/doctorService");
const AppointmentService = require("../services/appointmentService");
const { sendSuccess } = require("../utils/helpers");

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
    const blocks = await DoctorService.setAvailability(
      req.user.id,
      req.body.blocks
    );
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
    // doctorId comes from req.user.id (doctor role)
    const { monthStart, monthEnd } = req.query;
    const doctorId = req.user.id;
    const days = await AppointmentService.getCalendar(
      doctorId,
      monthStart,
      monthEnd
    );
    sendSuccess(res, { days });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByDate = async (req, res, next) => {
  try {
    // doctorId comes from req.user.id (doctor role)
    let { date } = req.query;
    const doctorId = req.user.id;
    const appointments = await AppointmentService.getByDate(doctorId, date);
    sendSuccess(res, { appointments });
  } catch (err) {
    next(err);
  }
};
