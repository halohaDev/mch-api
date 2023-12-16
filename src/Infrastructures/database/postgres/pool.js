/* istanbul ignore file */
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST || 'localhost',
  port: process.env.PGPORT_TEST || 5432,
  user: process.env.PGUSER_TEST || 'postgres',
  password: process.env.PGPASSWORD_TEST || 'postgres',
  database: process.env.PGDATABASE_TEST || 'mch_api_test',
};

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool({ ssl: true });

module.exports = pool;
