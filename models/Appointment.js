// models/Appointment.js
const db = require('../config/db');

class Appointment {
  static table = 'appointments';

  static async getCalendar(doctorId, monthStart, monthEnd) {
    const res = await db.query(
      `SELECT appointment_time
       FROM ${this.table}
       WHERE doctor_id=$1
         AND appointment_time BETWEEN $2 AND $3`,
      [doctorId, monthStart, monthEnd]
    );
    return res.rows.map(r => r.appointment_time);
  }

  static async getByDate(doctorId, dateStart, dateEnd) {
    const res = await db.query(
      `SELECT * FROM ${this.table}
       WHERE doctor_id=$1
         AND appointment_time BETWEEN $2 AND $3
       ORDER BY appointment_time`,
      [doctorId, dateStart, dateEnd]
    );
    return res.rows;
  }

  static async book({ user_id, doctor_id, appointment_time }) {
    const res = await db.query(
      `INSERT INTO ${this.table}
       (user_id, doctor_id, appointment_time)
       VALUES($1,$2,$3) RETURNING *`,
      [user_id, doctor_id, appointment_time]
    );
    return res.rows[0];
  }

  static async cancel(id) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET status='cancelled', updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [id]
    );
    return res.rows[0];
  }

  static async complete(id) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET status='completed', updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [id]
    );
    return res.rows[0];
  }
}

module.exports = Appointment;
