const InvariantError = require('../../Commons/exceptions/InvariantError');
const ShowNagari = require('../../Domains/nagari/entities/ShowNagari');
const NagariRepository = require('../../Domains/nagari/NagariRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class NagariRepositoryPostgres extends NagariRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableNagariName(name) {
    const lowerName = name.toLowerCase();

    const query = {
      text: 'SELECT name FROM nagari WHERE name = $1',
      values: [lowerName],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('tidak dapat membuat nagari baru karena nama sudah digunakan');
    }
  }

  async addNagari(createNagari) {
    const { name } = createNagari;
    const id = `nagari-${this._idGenerator(3)}`;
    const lowerName = name.toLowerCase();
    const query = {
      text: 'INSERT INTO nagari(id, name) VALUES($1, $2) RETURNING id, name',
      values: [id, lowerName],
    };

    const result = await this._pool.query(query);

    return new ShowNagari({ ...result.rows[0] });
  }

  async getNagariById(id) {
    const query = {
      text: 'SELECT id, name FROM nagari WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('nagari tidak ditemukan');
    }

    return new ShowNagari({ ...result.rows[0] });
  }
}

module.exports = NagariRepositoryPostgres;