// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user:     process.env.PGUSER,        // e.g. 'postgres'
  host:     process.env.PGHOST,        // e.g. 'localhost'
  database: process.env.PGDATABASE,    // your database name
  password: process.env.PGPASSWORD,    // your DB password
  port:     parseInt(process.env.PGPORT, 10) || 5432,
  max:      parseInt(process.env.PG_MAX_CLIENTS, 10) || 20,
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT, 10) || 30000,
  connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT, 10) || 2000,
});

// Log & exit on unexpected errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle Postgres client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
