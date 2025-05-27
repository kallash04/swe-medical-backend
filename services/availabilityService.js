// services/availabilityService.js
const db = require('../config/db');
const DoctorAvailability = require('../models/DoctorAvailability');
const { generateTimeSlots } = require('../utils/helpers');

class AvailabilityService {
  static async getWeekly(doctorId) {
    return DoctorAvailability.getByDoctor(doctorId);
  }

  static async setWeekly(doctorId, blocks) {
    // blocks: [{ day_of_week, start_time, end_time }, …]
    await db.query(
      `DELETE FROM doctor_availability WHERE doctor_id=$1`,
      [doctorId]
    );
    const inserted = [];
    for (const b of blocks) {
      inserted.push(
        await DoctorAvailability.create({
          doctor_id: doctorId,
          day_of_week: b.day_of_week,
          start_time: b.start_time,
          end_time: b.end_time
        })
      );
    }
    return inserted;
  }

  static async clearDay(doctorId, dayOfWeek) {
    return DoctorAvailability.clearByDoctorAndDay(doctorId, dayOfWeek);
  }

  static async generateSlotsForDate(doctorId, date) {
    // date: "YYYY-MM-DD"
    const dow = new Date(date).getDay();
    const allBlocks = await DoctorAvailability.getByDoctor(doctorId);
    const todayBlocks = allBlocks.filter(b => b.day_of_week === dow);
    let slots = [];
    for (const blk of todayBlocks) {
      slots = slots.concat(
        generateTimeSlots(blk.start_time, blk.end_time)
      );
    }
    return slots;
  }
}

module.exports = AvailabilityService;
