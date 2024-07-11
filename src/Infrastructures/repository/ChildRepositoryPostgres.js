const ChildRepository = require("../../Domains/children/ChildRepository");

class ChildRepositoryPostgres extends ChildRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addNewChild(newChild) {
    const {
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
    } = newChild;

    const query = {
      text: "INSERT INTO children (name, nik, birth_datetime, birth_weight, gender, father_name, pregnancy_age, delivery_place, delivery_method, helper, maternal_id, maternal_history_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id",
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
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
}

module.exports = ChildRepositoryPostgres;
