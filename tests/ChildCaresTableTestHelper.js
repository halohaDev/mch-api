/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");
const { snakeToCamelObject } = require("../src/Commons/helper");

const ChildCaresTableTestHelper = {
  // clean table test helper
  async cleanTable() {
    await pool.query("TRUNCATE TABLE child_cares CASCADE");
  },

  // add child care test helper
  async addChildCare({
    id = "child-care-123",
    childId = "child-123",
    jorongId = "jorong-123",
    midwifeId = "midwife-123",
    weight = 3,
    height = 50,
    headCircumference = 30,
    notes = "test",
    dateOfVisit = "2021-08-22",
    childCareType = "balita",
  }) {
    const query = {
      text: "INSERT INTO child_cares(id, child_id, jorong_id, midwife_id, weight, height, head_circumference, notes, date_of_visit) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      values: [id, childId, jorongId, midwifeId, weight, height, headCircumference, notes, dateOfVisit],
    };

    const result = await pool.query(query);
    return result;
  },

  async findChildCareById(id) {
    const query = {
      text: "SELECT * FROM child_cares WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return snakeToCamelObject(result.rows[0]);
  },
};

module.exports = ChildCaresTableTestHelper;
