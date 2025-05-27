// services/appointmentService.js
const Appointment = require('../models/Appointment');
const AvailabilityService = require('./availabilityService');

class AppointmentService {
  static async getCalendar(doctorId, monthStart, monthEnd) {
    // returns array of YYYY-MM-DD strings
    const times = await Appointment.getCalendar(
      doctorId,
      monthStart,
      monthEnd
    );
    const days = new Set();
    times.forEach(ts => {
      const d = new Date(ts).toISOString().split('T')[0];
      days.add(d);
    });
    return Array.from(days);
  }

  static async getSlots(doctorId, date) {
    // 1) generate all possible slots
    const possible = await AvailabilityService.generateSlotsForDate(
      doctorId,
      date
    );

    // 2) fetch existing appointments on that date
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    const appts = await Appointment.getByDate(
      doctorId,
      start.toISOString(),
      end.toISOString()
    );
    const booked = appts.map(a =>
      new Date(a.appointment_time).toISOString()
    );

    // 3) filter them out
    return possible.filter(slot => !booked.includes(slot));
  }

  static async book({ userId, doctorId, appointmentTime }) {
    const date = appointmentTime.split('T')[0];
    const slots = await this.getSlots(doctorId, date);
    if (!slots.includes(appointmentTime)) {
      throw new Error('Time slot not available');
    }
    return Appointment.book({
      user_id: userId,
      doctor_id: doctorId,
      appointment_time: appointmentTime
    });
  }

  static async cancel(appointmentId) {
    return Appointment.cancel(appointmentId);
  }

  static async complete(appointmentId) {
    return Appointment.complete(appointmentId);
  }
}

module.exports = AppointmentService;
