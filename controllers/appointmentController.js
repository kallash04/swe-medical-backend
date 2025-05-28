// controllers/appointmentController.js
const { log } = require("../models/HistoryLog");
const AppointmentService = require("../services/appointmentService");
const { sendSuccess } = require("../utils/helpers");

exports.getCalendar = async (req, res, next) => {
  try {
    const { doctorId, monthStart, monthEnd } = req.query;
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

exports.getSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    const slots = await AppointmentService.getSlots(doctorId, date);
    sendSuccess(res, { slots });
  } catch (err) {
    next(err);
  }
};

exports.book = async (req, res, next) => {
  try {
    const { doctorId, appointmentTime, serviceIds = [] } = req.body;
    // subtract one day, handles month/year boundaries and leap years
    const date = new Date(appointmentTime);
    date.setDate(date.getDate() + 1);

    const booking = await AppointmentService.book({
      userId: req.user.id,
      doctorId,
      appointmentTime: date.toISOString(),
      serviceIds,
    });
    sendSuccess(res, { booking }, 201);
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const cancelled = await AppointmentService.cancel(appointmentId);
    sendSuccess(res, { appointment: cancelled });
  } catch (err) {
    next(err);
  }
};

exports.complete = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const completed = await AppointmentService.complete(appointmentId);
    sendSuccess(res, { appointment: completed });
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    console.log("Fetching services for appointment:", appointmentId);
    const services = await AppointmentService.getServices(appointmentId);
    sendSuccess(res, { services });
  } catch (err) {
    next(err);
  }
};
