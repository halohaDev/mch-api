/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

// create test helper for authentications table
// with asunc function add token, find token, and clean table with turncate

const AuthenticationsTableTestHelper = {
  // add token test helper
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  // find token test helper
  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  // clean table test helper
  async cleanTable() {
    await pool.query('TRUNCATE TABLE authentications');
  },
};

module.exports = AuthenticationsTableTestHelper;
