const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ChildCareRepository = require("../../Domains/child_care/ChildCareRepository");
const ChildQuery = require("../queries/ChildCareQuery");

class ChildCareRepositoryPostgres extends ChildCareRepository {
  constructor(pool, idGenerator, snakeToCamelCase) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamelCase = snakeToCamelCase;
    this._childQuery = new ChildQuery({ pool });
  }

  async addChildCare(newChildCare) {
    const { childId, jorongId, midwifeId, weight, height, headCircumference, notes, dateOfVisit } = newChildCare;
    const id = `child-care-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO child_cares VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, child_id, jorong_id, midwife_id, weight, height, head_circumference, notes, date_of_visit",
      values: [id, childId, jorongId, midwifeId, weight, height, headCircumference, notes, dateOfVisit],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelCase(result.rows[0]);
  }

  async updateChildCare(id, newChildCare) {
    const { childId, jorongId, midwifeId, weight, height, headCircumference, notes, dateOfVisit } = newChildCare;
    const query = {
      text: "UPDATE child_cares SET child_id = $2, jorong_id = $3, midwife_id = $4, weight = $5, height = $6, head_circumference = $7, notes = $8, date_of_visit = $9 WHERE id = $1 RETURNING id, child_id, jorong_id, midwife_id, weight, height, head_circumference, notes, date_of_visit",
      values: [id, childId, jorongId, midwifeId, weight, height, headCircumference, notes, dateOfVisit],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelCase(result.rows[0]);
  }

  async deleteChildCareById(id) {
    const query = {
      text: "DELETE FROM child_cares WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelCase(result.rows[0]);
  }

  async showChildCares(queryParams) {
    const result = await this._childQuery.joins(["childs"]).wheres(queryParams).selects(["child_cares.*"]).paginate();

    result.data = this._snakeToCamelCase(result.data);

    return result;
  }

  async findChildCareById(id) {
    const query = {
      text: "SELECT * FROM child_cares WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("child care tidak ditemukan");
    }

    return this._snakeToCamelCase(result.rows[0]);
  }
}

module.exports = ChildCareRepositoryPostgres;
