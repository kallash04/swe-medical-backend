// models/MedicalRecord.js
const db = require('../config/db');

class MedicalRecord {
  static table = 'medical_records';

  static async findByUserId(userId) {
    const res = await db.query(
      `SELECT * FROM ${this.table}
       WHERE user_id=$1`,
      [userId]
    );
    return res.rows[0];
  }

  static async create({ user_id, data, last_edited_by }) {
    const res = await db.query(
      `INSERT INTO ${this.table}
       (user_id, data, last_edited_by)
       VALUES($1,$2,$3) RETURNING *`,
      [user_id, data, last_edited_by]
    );
    return res.rows[0];
  }

  static async update(recordId, data, editorId) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET data=$1, last_edited_by=$2, last_edited_at=NOW()
       WHERE id=$3 RETURNING *`,
      [data, editorId, recordId]
    );
    return res.rows[0];
  }
}

module.exports = MedicalRecord;
