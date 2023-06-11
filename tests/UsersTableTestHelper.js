/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  // add user test helper
  async addUser({
    id = 'user-123', email = 'user@mail.com', password = 'secret_password', name = 'User Test',
  }) {
    const query = {
      text: 'INSERT INTO users(id, email, password, name) VALUES($1, $2, $3, $4)',
      values: [id, email, password, name],
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
