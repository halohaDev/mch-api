const ChildRepository = require("../../Domains/child/ChildRepository");

class ChildRepositoryPostgres extends ChildRepository {
  constructor(pool, idGenerator, snakeToCamelCase) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamelCase = snakeToCamelCase;
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
    } = newChild;

    const id = `child-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO children (name, nik, birth_datetime, birth_weight, gender, father_name, pregnancy_age, delivery_place, delivery_method, helper, maternal_id, maternal_history_id, id, birth_height) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
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
}

module.exports = ChildRepositoryPostgres;
