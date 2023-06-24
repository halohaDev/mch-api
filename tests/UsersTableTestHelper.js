/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  // add user test helper
  async addUser({
    id = 'user-123', email = 'user@mail.com', password = 'secret_password', name = 'User Test', nik = '1234567890', role = 'mother', phoneNumber = '081234567890',
  }) {
    const query = {
      text: 'INSERT INTO users(id, email, password, name, nik, role, phone_number) VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, email, password, name, nik, role, phoneNumber],
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
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
