// models/DoctorAvailability.js
const db = require('../config/db');

class DoctorAvailability {
  static table = 'doctor_availability';

  static async getByDoctor(doctorId) {
    const res = await db.query(
      `SELECT da.*
       FROM ${this.table} da
       LEFT JOIN appointments a
       ON da.doctor_id = a.doctor_id
       AND da.day_of_week = EXTRACT(DOW FROM a.appointment_time)
       AND a.status != 'cancelled'
       AND a.appointment_time::time >= da.start_time
       AND a.appointment_time::time < da.end_time
       WHERE da.doctor_id = $1
       AND a.id IS NULL
       ORDER BY da.day_of_week, da.start_time`,
      [doctorId]
    );
    return res.rows;
  }

  static async create({ doctor_id, day_of_week, start_time, end_time }) {
    const res = await db.query(
      `INSERT INTO ${this.table}
       (doctor_id, day_of_week, start_time, end_time)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [doctor_id, day_of_week, start_time, end_time]
    );
    return res.rows[0];
  }

  static async update(id, { start_time, end_time }) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET start_time=$1, end_time=$2
       WHERE id=$3 RETURNING *`,
      [start_time, end_time, id]
    );
    return res.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM ${this.table} WHERE id=$1`, [id]);
    return true;
  }

  static async clearByDoctorAndDay(doctorId, dayOfWeek) {
    await db.query(
      `DELETE FROM ${this.table}
       WHERE doctor_id=$1 AND day_of_week=$2`,
      [doctorId, dayOfWeek]
    );
    return true;
  }
}

module.exports = DoctorAvailability;
