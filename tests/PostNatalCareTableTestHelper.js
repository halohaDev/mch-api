/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const {
  randomNumber,
  randomFromArray,
  randomDate,
} = require("../src/Commons/helper");

const PostNatalCareTableTestHelper = {
  // add post natal care
  async addPostAnteNatalCare({
    id = "pnc-123",
    bloodPressure = 120,
    temprature = 36,
    vit_a = false,
    fe = false,
    postNatalType = 'pnc_1',
    maternalHistoryId = "maternal-history-123",
    jorongId = "jorong-123",
    midwifeId = "user-123",
    dateOfVisit = "2021-08-21",
  }) {
    const query = {
      text: `INSERT INTO post_natal_cares (
        id, blood_pressure, temprature, vit_a, fe, post_natal_type, maternal_history_id, jorong_id, midwife_id, date_of_visit
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )`,
      values: [
        id,
        bloodPressure,
        temprature,
        vit_a,
        fe,
        postNatalType,
        maternalHistoryId,
        jorongId,
        midwifeId,
        dateOfVisit,
      ],
    };

    await pool.query(query);
  },

  // get post natal care by id
  async findPostAnteNatalCareById(id) {
    const query = {
      text: "SELECT * FROM post_natal_cares WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  // clean table using turncate
  async cleanTable() {
    await pool.query("TRUNCATE TABLE post_natal_cares");
  },
};

module.exports = PostNatalCareTableTestHelper;

