// models/Appointment.js
const db = require("../config/db");

class Appointment {
  static table = "appointments";

  static async getCalendar(doctorId, monthStart, monthEnd) {
    const res = await db.query(
      `SELECT appointment_time
       FROM ${this.table}
       WHERE doctor_id=$1
         AND appointment_time BETWEEN $2 AND $3`,
      [doctorId, monthStart, monthEnd]
    );
    return res.rows.map((r) => r.appointment_time);
  }

  static async getByDate(doctorId, dateStart, dateEnd) {
    const res = await db.query(
      `SELECT a.*,
              u.name   AS user_name,
              u.profile_photo_url  AS user_photo
       FROM ${this.table} a
       JOIN users u ON a.user_id = u.id
       WHERE a.doctor_id = $1
         AND a.appointment_time BETWEEN $2 AND $3
       ORDER BY a.appointment_time`,
      [doctorId, dateStart, dateEnd]
    );
    return res.rows;
  }

  static async getByDate(doctorId, date) {
    const dateStart = new Date(date);
    const dateEnd = new Date(date);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const res = await db.query(
      `SELECT a.*,
              u.name   AS user_name,
              u.profile_photo_url  AS user_photo
       FROM ${this.table} a
       JOIN users u ON a.user_id = u.id
       WHERE a.doctor_id = $1
         AND a.appointment_time BETWEEN $2 AND $3
       ORDER BY a.appointment_time`,
      [doctorId, dateStart.toISOString(), dateEnd.toISOString()]
    );
    return res.rows;
  }

  static async book({
    user_id,
    doctor_id,
    appointment_time,
    service_ids = [],
  }) {
    const res = await db.query(
      `INSERT INTO ${this.table}
       (user_id, doctor_id, appointment_time)
       VALUES($1,$2,$3) RETURNING *`,
      [user_id, doctor_id, appointment_time]
    );
    const appointment = res.rows[0];
    // Insert into appointment_services join table
    if (service_ids.length > 0) {
      const values = service_ids.map((sid, i) => `($1, $${i + 2})`).join(",");
      await db.query(
        `INSERT INTO appointment_services(appointment_id, service_id) VALUES ${values}`,
        [appointment.id, ...service_ids]
      );
    }
    return appointment;
  }

  static async getServices(appointmentId) {
    const res = await db.query(
      `SELECT s.* FROM services s
       JOIN appointment_services aps ON aps.service_id = s.id
       WHERE aps.appointment_id = $1`,
      [appointmentId]
    );

    return res.rows;
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
