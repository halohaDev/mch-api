/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const MaternalComplicationsTableTestHelper = {
  // clean table test helper
  async cleanTable() {
    await pool.query("TRUNCATE TABLE maternal_complications CASCADE");
  },

  // add maternal_complication test helper
  async addMaternalComplication({
    id = "mc-123",
    maternalHistoryId = "maternal-history-123",
    isHandled = "true",
    isReferred = "true",
    complicationType = "others",
    description = "test",
    comeCondition = "alive",
    backCondition = "alive",
    complicationDate = "2021-08-22",
  }) {
    const query = {
      text: "INSERT INTO maternal_complications(id, maternal_history_id, is_handled, is_referred, complication_type, description, come_condition, back_condition, complication_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      values: [id, maternalHistoryId, isHandled, isReferred, complicationType, description, comeCondition, backCondition, complicationDate],
    };

    await pool.query(query);
  },

  // find maternal_complication by id test helper
  async findMaternalComplicationById(id) {
    const query = {
      text: "SELECT * FROM maternal_complications WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
};

module.exports = MaternalComplicationsTableTestHelper;
