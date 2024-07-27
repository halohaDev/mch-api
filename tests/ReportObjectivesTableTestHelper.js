/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");
const { snakeToCamelObject } = require("../src/Commons/helper");

const ReportObjectivesTableTestHelper = {
  // add report objectives
  async addReportObjectives({
    reportYear = 2021,
    jorongId = "jorong-123",
    anteNatalTarget = 10,
    postNatalTarget = 10,
    deliveryTarget = 10,
    anteNatalHighRiskTarget = 10,
    balitaTarget = 10,
    neoRestiTarget = 10,
    babyTarget = 10,
    deliveredBabyAliveTarget = 10,
    praSekolahTarget = 10,
  }) {
    const query = {
      text: "INSERT INTO report_objectives(report_year, jorong_id, ante_natal_target, post_natal_target, delivery_target, ante_natal_high_risk_target, balita_target, neo_resti_target, baby_target, delivered_baby_alive_target, pra_sekolah_target) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      values: [
        reportYear,
        jorongId,
        anteNatalTarget,
        postNatalTarget,
        deliveryTarget,
        anteNatalHighRiskTarget,
        balitaTarget,
        neoRestiTarget,
        babyTarget,
        deliveredBabyAliveTarget,
        praSekolahTarget,
      ],
    };

    await pool.query(query);
  },

  // search by jorong_id and report_year
  async findReportObjectivesByJorongIdAndReportYear(jorongId, reportYear) {
    const query = {
      text: "SELECT * FROM report_objectives WHERE jorong_id = $1 AND report_year = $2",
      values: [jorong_id, report_year],
    };

    const result = await pool.query(query);

    return snakeToCamelObject(result.rows[0]);
  },

  // turncaste
  async cleanTable() {
    await pool.query("DELETE FROM report_objectives");
  },
};

module.exports = ReportObjectivesTableTestHelper;
