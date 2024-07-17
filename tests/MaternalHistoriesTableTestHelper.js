/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const MaternalHistoriesTableTestHelper = {
  // clean table test helper
  async cleanTable() {
    await pool.query("DELETE FROM maternal_histories WHERE 1=1");
  },

  // add maternal_history test helper
  async addMaternalHistory({
    id = "maternal-history-123",
    maternalId = "maternal-123",
    periodDuration = "5",
    periodAmount = "2",
    periodConcern = "test",
    periodCycle = "30",
    lastIllness = "test",
    currentIllness = "test",
    gemeli = "false",
    edd = "2021-08-22",
    hpht = "2021-08-22",
    weightBeforePregnancy = "50",
    maternalStatus = "pregnant",
  }) {
    const query = {
      text: "INSERT INTO maternal_histories(id, maternal_id, period_duration, period_amount, period_concern, period_cycle, last_illness, current_illness, gemeli, edd, hpht, weight_before_pregnancy, maternal_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)",
      values: [
        id,
        maternalId,
        periodDuration,
        periodAmount,
        periodConcern,
        periodCycle,
        lastIllness,
        currentIllness,
        gemeli,
        edd,
        hpht,
        weightBeforePregnancy,
        maternalStatus,
      ],
    };

    await pool.query(query);
  },

  // find maternal_history by maternal id test helper
  async findMaternalHistoryByMaternalId(maternalId) {
    const query = {
      text: "SELECT * FROM maternal_histories WHERE maternal_id = $1",
      values: [maternalId],
    };

    await pool.query(query);
  },

  // find maternal_history by id test helper
  async findMaternalHistoryById(id) {
    const query = {
      text: "SELECT * FROM maternal_histories WHERE id = $1 LIMIT 1",
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async updateRiskStatus(id, riskStatus) {
    const query = {
      text: "UPDATE maternal_histories SET risk_status = $1 WHERE id = $2",
      values: [riskStatus, id],
    };

    await pool.query(query);
  },
};

module.exports = MaternalHistoriesTableTestHelper;
