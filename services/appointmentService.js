// services/appointmentService.js
const Appointment = require("../models/Appointment");
const AvailabilityService = require("./availabilityService");

class AppointmentService {
  static async getCalendar(doctorId, monthStart, monthEnd) {
    // Returns array of YYYY-MM-DD strings where doctor is in office and has at least one available slot
    const start = new Date(monthStart);
    const end = new Date(monthEnd);
    const days = [];
    let d = new Date(start);
    while (d <= end) {
      const dateStr = d.toISOString().split("T")[0];
      // 1) Check if doctor is in office that day
      const dow = d.getDay();
      const allBlocks = await require("./availabilityService").getWeekly(
        doctorId
      );
      const todayBlocks = allBlocks.filter((b) => b.day_of_week === dow);
      if (todayBlocks.length === 0) {
        d.setDate(d.getDate() + 1);
        continue;
      }
      // 2) Generate all possible slots
      const { generateTimeSlots } = require("../utils/helpers");
      let possible = [];
      for (const blk of todayBlocks) {
        possible = possible.concat(
          generateTimeSlots(d, blk.start_time, blk.end_time)
        );
      }
      if (possible.length === 0) {
        d.setDate(d.getDate() + 1);
        continue;
      }
      // 3) Fetch booked slots
      const appts = await require("../models/Appointment").getByDate(
        doctorId,
        new Date(dateStr).toISOString(),
        new Date(
          new Date(dateStr).getTime() + 24 * 60 * 60 * 1000
        ).toISOString()
      );
      const booked = appts.map((a) =>
        new Date(a.appointment_time).toISOString()
      );
      // 4) If at least one slot is available, include the day
      const available = possible.filter((slot) => !booked.includes(slot));
      if (available.length > 0) days.push(dateStr);
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  static async getSlots(doctorId, date) {
    console.log(`Fetching slots for doctor ${doctorId} on ${date}`);

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
    const booked = appts.map((a) => new Date(a.appointment_time).toISOString());

    console.log(
      `Possible slots: ${possible}, Booked slots: ${booked.length}`
    );

    // 3) filter them out
    return possible.filter((slot) => !booked.includes(slot));
  }

  static async book({ userId, doctorId, appointmentTime, serviceIds = [] }) {
    const date = appointmentTime.split("T")[0];
    const slots = await this.getSlots(doctorId, date);
    if (!slots.includes(appointmentTime)) {
      throw new Error("Time slot not available");
    }
    return Appointment.book({
      user_id: userId,
      doctor_id: doctorId,
      appointment_time: appointmentTime,
      service_ids: serviceIds,
    });
  }

  static async cancel(appointmentId) {
    return Appointment.cancel(appointmentId);
  }

  static async complete(appointmentId) {
    return Appointment.complete(appointmentId);
  }

  static async getByDate(doctorId, date) {
    return Appointment.getByDate(
      doctorId,
      date + "T00:00:00.000Z",
      date + "T23:59:59.999Z"
    );
  }

  static async getServices(appointmentId) {
    return Appointment.getServices(appointmentId);
  }
}

module.exports = AppointmentService;
