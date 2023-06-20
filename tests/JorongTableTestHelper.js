/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const JorongTableTestHelper = {
  // add jorong test helper
  async addJorong({
    id = 'jorong-123', name = 'Jorong Test', nagariId = 'nagari-123',
  }) {
    const query = {
      text: 'INSERT INTO jorong(id, name, nagari_id) VALUES($1, $2, $3)',
      values: [id, name, nagariId],
    };

    await pool.query(query);
  },

  // find jorong test helper
  async findJorongById(id) {
    const query = {
      text: 'SELECT * FROM jorong WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  // clean table test helper
  async cleanTable() {
    await pool.query('TRUNCATE TABLE jorong');
  },
};

module.exports = JorongTableTestHelper;
