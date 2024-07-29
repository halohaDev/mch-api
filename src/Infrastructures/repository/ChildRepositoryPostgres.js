const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ChildRepository = require("../../Domains/child/ChildRepository");
const ChildQuery = require("../queries/ChildQuery");

class ChildRepositoryPostgres extends ChildRepository {
  constructor(pool, idGenerator, snakeToCamelCase) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamelCase = snakeToCamelCase;
    this._childQuery = new ChildQuery({ pool });
  }

  async addChild(newChild) {
    const {
      name,
      nik,
      birthDatetime,
      birthWeight,
      birthHeight,
      gender,
      fatherName,
      pregnancyAge,
      deliveryPlace,
      deliveryMethod,
      helper,
      maternalId,
      maternalHistoryId,
      birthStatus,
    } = newChild;

    const id = `child-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO children (name, nik, birth_datetime, birth_weight, gender, father_name, pregnancy_age, delivery_place, delivery_method, helper, maternal_id, maternal_history_id, id, birth_height, birth_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
      values: [
        name,
        nik,
        birthDatetime,
        birthWeight,
        gender,
        fatherName,
        pregnancyAge,
        deliveryPlace,
        deliveryMethod,
        helper,
        maternalId,
        maternalHistoryId,
        id,
        birthHeight,
        birthStatus,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getChildByMaternalId(maternalId) {
    const query = {
      text: `SELECT * FROM children WHERE maternal_id = $1`,
      values: [maternalId],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelCase(result.rows);
  }

  async findChildById(childId) {
    const query = {
      text: `SELECT * FROM children WHERE id = $1`,
      values: [childId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Child not found");
    }

    return this._snakeToCamelCase(result.rows[0]);
  }

  async getChildByIds(childIds) {
    const query = {
      text: `SELECT * FROM children WHERE id = ANY($1)`,
      values: [childIds],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelCase(result.rows);
  }

  async showChilds(queryParams) {
    const result = await this._childQuery.joins(["maternals"]).wheres(queryParams).selects(["children.*"]).paginate();

    result.data = this._snakeToCamelCase(result.data);

    return result;
  }
}

module.exports = ChildRepositoryPostgres;
