/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const NagariTableTestHelper = {
  // add nagari test helper
  async addNagari({
    id = 'nagari-123', name = 'Nagari Test',
  }) {
    const query = {
      text: 'INSERT INTO nagari(id, name) VALUES($1, $2)',
      values: [id, name],
    };

    await pool.query(query);
  },

  // find nagari test helper
  async findNagariById(id) {
    const query = {
      text: 'SELECT * FROM nagari WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  // clean table test helper
  async cleanTable() {
    await pool.query('DELETE FROM nagari WHERE 1=1');
  },
};

module.exports = NagariTableTestHelper;
