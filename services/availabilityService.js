// services/availabilityService.js
const db = require("../config/db");
const DoctorAvailability = require("../models/DoctorAvailability");
const { generateTimeSlots } = require("../utils/helpers");

class AvailabilityService {
  static async getWeekly(doctorId) {
    return DoctorAvailability.getByDoctor(doctorId);
  }

  static async setWeekly(doctorId, blocks) {
    // blocks: [{ day_of_week, start_time, end_time }, …]
    await db.query(`DELETE FROM doctor_availability WHERE doctor_id=$1`, [
      doctorId,
    ]);
    const inserted = [];
    for (const b of blocks) {
      inserted.push(
        await DoctorAvailability.create({
          doctor_id: doctorId,
          day_of_week: b.day_of_week,
          start_time: b.start_time,
          end_time: b.end_time,
        })
      );
    }
    return inserted;
  }

  static async clearDay(doctorId, dayOfWeek) {
    return DoctorAvailability.clearByDoctorAndDay(doctorId, dayOfWeek);
  }

  // 1) Get unfiltered availability blocks for a given day-of-week
  static async getBlocksForDoctor(doctorId, dayOfWeek) {
    if (dayOfWeek == 0) {
      dayOfWeek = 7; // convert Sunday (0) to 7 for our DB
    } else {
      dayOfWeek = dayOfWeek - 1;
    }
    const res = await db.query(
      `SELECT *
     FROM doctor_availability
     WHERE doctor_id    = $1
       AND day_of_week  = $2
     ORDER BY start_time`,
      [doctorId, dayOfWeek]
    );
    console.log(
      `Found ${res.rows} blocks for doctor ${doctorId} on day ${dayOfWeek}`
    );

    return res.rows;
  }

  // 2) Get all booked times (as "HH:MM") for a particular date
  static async getBookedTimes(doctorId, date) {
    const res = await db.query(
      `SELECT (appointment_time::time)::text AS time_str
     FROM appointments
     WHERE doctor_id = $1
       AND appointment_time::date = $2
       AND status != 'cancelled'`,
      [doctorId, date]
    );
    console.log(
      `Found ${res.rows} booked times for doctor ${doctorId} on date ${date}`
    );

    // time_str comes back like "09:30:00"; strip seconds:
    return new Set(res.rows.map((r) => r.time_str.substr(0, 5)));
  }

  static async generateSlotsForDate(doctorId, date) {
    // parse date at local midnight to avoid the "YYYY-MM-DD" → UTC shift
    const base = new Date(`${date}T00:00:00`);
    const dow = base.getDay();

    console.log(
      `Generating slots for doctor ${doctorId} on ${date} (dow=${dow})`
    );

    const blocks = await this.getBlocksForDoctor(doctorId, dow);
    const bookedTimes = await this.getBookedTimes(doctorId, date);

    let slots = [];
    for (const blk of blocks) {
      // this returns ISO strings like "2025-05-29T09:00:00.000Z"
      const allSlots = generateTimeSlots(date, blk.start_time, blk.end_time);

      // keep only those not in the booked set
      const available = allSlots.filter((slotIso) => {
        // pull out "HH:MM" in *local* time
        const t = new Date(slotIso).toTimeString().slice(0, 5);
        return !bookedTimes.has(t);
      });

      slots.push(...available);
    }

    return slots;
  }
}

module.exports = AvailabilityService;
