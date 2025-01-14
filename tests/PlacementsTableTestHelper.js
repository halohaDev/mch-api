/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const PlacementsTableTestHelper = {
  // add placement test helper
  async addPlacement({
    midwifeId = 'midwife-123', jorongId = 'jorong-123', placementDate = '2021-01-01T00:00:00.000Z',
  }) {
    const query = {
      text: 'INSERT INTO placements VALUES($1, $2, $3)',
      values: [midwifeId, jorongId, placementDate],
    };

    await pool.query(query);
  },

  // find placement test helper
  async findPlacementByIds(midwifeId, jorongId) {
    const query = {
      text: 'SELECT * FROM placements WHERE midwife_id = $1 AND jorong_id = $2',
      values: [midwifeId, jorongId],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  // clean table test helper
  async cleanTable() {
    await pool.query('DELETE FROM placements WHERE 1=1');
  },
};

module.exports = PlacementsTableTestHelper;