/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ChildrenTableTestHelper = {
  // clean table test helper
  async cleanTable() {
    await pool.query("TRUNCATE TABLE children CASCADE");
  },

  // add child test helper
  async addChild({
    id = "child-123",
    name = "test",
    nik = "123",
    birthDatetime = "2021-08-22",
    birthWeight = "3",
    birthHeight = "50",
    gender = "L",
    fatherName = "test",
    pregnancyAge = "9",
    deliveryPlace = "puskesmas",
    deliveryMethod = "normal",
    helper = "bidan",
    maternalId = "maternal-123",
    maternalHistoryId = null,
  }) {
    const query = {
      text: "INSERT INTO children(id, name, nik, birth_datetime, birth_weight, birth_height, gender, father_name, pregnancy_age, delivery_place, delivery_method, helper, maternal_id, maternal_history_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      values: [
        id,
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
      ],
    };

    const result = await pool.query(query);
    return result;
  },

  async findChildById(id) {
    const query = {
      text: "SELECT * FROM children WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },
};

module.exports = ChildrenTableTestHelper;
