const PlacementRepository = require('../../Domains/placements/PlacementRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class PlacementRepositoryPostgres extends PlacementRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addPlacement({
    midwifeId,
    jorongId,
    placementDate,
  }) {
    const query = {
      text: 'INSERT INTO placements(midwife_id, jorong_id, placement_date) VALUES($1, $2, $3) RETURNING midwife_id, jorong_id, placement_date',
      values: [midwifeId, jorongId, placementDate],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async findPlacementByIds(midwifeId, jorongId) {
    const query = {
      text: 'SELECT midwife_id, jorong_id FROM placements WHERE midwife_id = $1 AND jorong_id = $2',
      values: [midwifeId, jorongId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('placement tidak ditemukan');
    }

    return rows[0];
  }
}

module.exports = PlacementRepositoryPostgres;
