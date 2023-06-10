/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  // add user test helper
  async addUser({
    id = 'user-123', username = 'user_test', password = 'secret_password', fullname = 'User Test',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  // find user test helper
  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  // clean table test helper
  async cleanTable() {
    await pool.query('TRUNCATE TABLE users');
  },
};

module.exports = UsersTableTestHelper;
