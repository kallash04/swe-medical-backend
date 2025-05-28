// models/Services.js
const db = require('../config/db');

class Services {
  static table = 'services';

  static async getAll() {
    const res = await db.query(`SELECT * FROM ${this.table} ORDER BY name`);
    return res.rows;
  }

  static async getById(id) {
    const res = await db.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  }

  static async create({ name, fee }) {
    const res = await db.query(
      `INSERT INTO ${this.table}(name, fee)
       VALUES($1, $2) RETURNING *`,
      [name, fee]
    );
    return res.rows[0];
  }

  static async update(id, { name, fee }) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET name=$1, fee=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [name, fee, id]
    );
    return res.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return true;
  }
}

module.exports = Services;
