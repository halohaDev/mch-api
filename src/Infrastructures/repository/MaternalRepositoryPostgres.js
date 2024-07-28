const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const MaternalRepository = require("../../Domains/maternal/MaternalRepository");
const MaternalQuery = require("../queries/MaternalQuery");

class MaternalRepositoryPostgres extends MaternalRepository {
  constructor(pool, idGenerator, snakeToCamelCaseObject) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamelCaseObject = snakeToCamelCaseObject;
    this._maternalQuery = new MaternalQuery({ pool });
  }

  async addMaternal(addMaternal) {
    const { userId, menarcheDate, maritalDate, numberOfMarriage, maritalStatus, jorongId } = addMaternal;
    const id = `maternal-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO maternals(id, user_id, menarche_date, marital_date, number_of_marriage, marital_status, jorong_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, userId, menarcheDate, maritalDate, numberOfMarriage, maritalStatus, jorongId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async findMaternalByUserId(userId) {
    const query = {
      text: "SELECT * FROM maternals WHERE user_id = $1 LIMIT 1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("maternal tidak ditemukan");
    }

    return result.rows[0];
  }

  async updateMaternalByUserId(userId, updateMaternal) {
    const { menarcheDate, maritalDate, numberOfMarriage, maritalStatus } = updateMaternal;

    const query = {
      text: "UPDATE maternals SET menarche_date = $1, marital_date = $2, number_of_marriage = $3, marital_status = $4 WHERE user_id = $5 RETURNING id",
      values: [menarcheDate, maritalDate, numberOfMarriage, maritalStatus, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("maternal tidak ditemukan");
    }

    return result.rows[0].id;
  }

  async showAllMaternal(queryParams) {
    const maternals = await this._maternalQuery
      .joins(["users", "jorong", "lastMaternalStatus"])
      .selects([
        "maternals.id",
        "users.name as name",
        "users.nik as nik",
        "users.address",
        "jorong.name as jorong_name",
        "maternals.user_id",
        "maternal_histories.maternal_status as status",
        "maternal_histories.id as maternal_history_id",
      ])
      .wheres(queryParams)
      .paginate();

    const convertedData = maternals.data.map((maternal) => {
      return this._snakeToCamelCaseObject(maternal);
    });

    return {
      data: convertedData,
      meta: maternals.meta,
    };
  }

  async findMaternalById(id) {
    const query = {
      text: "SELECT * FROM maternals WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("maternal tidak ditemukan");
    }

    return this._snakeToCamelCaseObject(result.rows[0]);
  }

  async getMaternalByIds(ids) {
    const query = {
      text: "SELECT * FROM maternals WHERE id = ANY($1)",
      values: [ids],
    };

    const result = await this._pool.query(query);

    return this._snakeToCamelCaseObject(result.rows);
  }
}

module.exports = MaternalRepositoryPostgres;
