// models/HistoryLog.js
const db = require('../config/db');

class HistoryLog {
  static table = 'history_log';

  static async log({ record_id, changed_by, change_type, change_details }) {
    const res = await db.query(
      `INSERT INTO ${this.table}
       (record_id, changed_by, change_type, change_details)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [record_id, changed_by, change_type, change_details]
    );
    return res.rows[0];
  }

  static async findByRecord(recordId) {
    const res = await db.query(
      `SELECT * FROM ${this.table}
       WHERE record_id=$1
       ORDER BY change_timestamp DESC`,
      [recordId]
    );
    return res.rows;
  }
}

module.exports = HistoryLog;
