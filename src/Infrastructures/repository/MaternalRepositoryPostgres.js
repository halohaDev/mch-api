const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const MaternalRepository = require('../../Domains/maternal/MaternalRepository');

class MaternalRepositoryPostgres extends MaternalRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addMaternal(addMaternal) {
    const {
      userId, menarcheDate, martialDate, numberOfMarriage, martialStatus,
    } = addMaternal;
    const id = `maternal-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO maternals(id, user_id, menarche_date, martial_date, number_of_marriage, martial_status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, userId, menarcheDate, martialDate, numberOfMarriage, martialStatus],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async findMaternalByUserId(userId) {
    const query = {
      text: 'SELECT * FROM maternals WHERE user_id = $1 LIMIT 1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('maternal tidak ditemukan');
    }

    return result.rows[0];
  }

  async updateMaternalByUserId(userId, updateMaternal) {
    const {
      menarcheDate, martialDate, numberOfMarriage, martialStatus,
    } = updateMaternal;

    const query = {
      text: 'UPDATE maternals SET menarche_date = $1, martial_date = $2, number_of_marriage = $3, martial_status = $4 WHERE user_id = $5 RETURNING id',
      values: [menarcheDate, martialDate, numberOfMarriage, martialStatus, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('maternal tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = MaternalRepositoryPostgres;
