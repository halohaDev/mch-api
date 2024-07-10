const PostNatalCareRepository = require('../../Domains/post_natal/PostNatalCareRepository');

class PostNatalCareRepositoryPostgres extends PostNatalCareRepository {
  constructor(pool, idGenerator, snakeToCamelCaseObject) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamelCaseObject = snakeToCamelCaseObject;
  }

  async addPostNatalCare(payload) {
    const {
      maternalHistoryId,
      jorongId,
      midwifeId,
      bloodPressure,
      temperature,
      vitA,
      fe,
      contactType
    } = payload;

    const id = `pnc-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO post_natal_cares (id, blood_pressure, temperature, vit_a, fe, maternal_history_id, jorong_id, midwife_id, contact_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [id, bloodPressure, temperature, vitA, fe, maternalHistoryId, jorongId, midwifeId, contactType],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelCaseObject(result.rows[0]);
  }
}

module.exports = PostNatalCareRepositoryPostgres;
