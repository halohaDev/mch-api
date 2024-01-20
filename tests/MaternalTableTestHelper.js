/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const MaternalTableTestHelper = {
  // clean table test helper
  async cleanTable() {
    await pool.query("DELETE FROM maternals WHERE 1=1");
  },

  // add maternal test helper
  async addMaternal({
    id = "maternal-123",
    userId = "user-123",
    menarcheDate = "2021-08-22",
    maritalDate = "2021-08-22",
    numberOfMarriage = "1",
    maritalStatus = "single",
  }) {
    const query = {
      text: "INSERT INTO maternals(id, user_id, menarche_date, marital_date, number_of_marriage, marital_status) VALUES($1, $2, $3, $4, $5, $6)",
      values: [
        id,
        userId,
        menarcheDate,
        maritalDate,
        numberOfMarriage,
        maritalStatus,
      ],
    };

    await pool.query(query);
  },

  // find maternal by user id test helper
  async findMaternalByUserId(userId) {
    const query = {
      text: "SELECT * FROM maternals WHERE user_id = $1",
      values: [userId],
    };

    await pool.query(query);
  },

  // find maternal by id test helper
  async findMaternalById(id) {
    const query = {
      text: "SELECT * FROM maternals WHERE id = $1 LIMIT 1",
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },
};

module.exports = MaternalTableTestHelper;
