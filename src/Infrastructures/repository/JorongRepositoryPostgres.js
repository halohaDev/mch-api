const JorongRepository = require("../../Domains/jorong/JorongRepository");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const JorongQuery = require("../queries/JorongQuery");

class JorongRepositoryPostgres extends JorongRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._jorongQuery = new JorongQuery({ pool });
  }

  async verifyAvailableJorongName(name) {
    const lowerName = name.toLowerCase();

    const query = {
      text: "SELECT name FROM jorong WHERE name = $1",
      values: [lowerName],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("tidak dapat membuat jorong baru karena nama sudah digunakan");
    }

    return true;
  }

  async addJorong(createJorong) {
    const { name, nagariId } = createJorong;
    const id = `jorong-${this._idGenerator(3)}`;
    const lowerName = name.toLowerCase();
    const query = {
      text: "INSERT INTO jorong(id, name, nagari_id) VALUES($1, $2, $3) RETURNING id, name, nagari_id",
      values: [id, lowerName, nagariId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getJorongById(id) {
    const query = {
      text: "SELECT jorong.id, jorong.name, jorong.nagari_id FROM jorong WHERE jorong.id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("jorong tidak ditemukan");
    }

    return result.rows[0];
  }

  async getJorong(queryParams) {
    const result = this._jorongQuery.wheres(queryParams).paginate();
    return result;
  }

  async getJorongsByIds(jorongIds) {
    const jorongIdsString = jorongIds.join("','");
    const query = {
      text: `SELECT id, name FROM jorong WHERE id IN ('${jorongIdsString}')`,
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = JorongRepositoryPostgres;
