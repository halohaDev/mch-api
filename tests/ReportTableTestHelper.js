/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ReportTableTestHelper = {
  // add report
  async addReport({
    id = "report-123",
    midwifeId = "midwife-123",
    jorongId = "jorong-123",
    approvedBy = null,
    data = {},
    reportType = "anc_jorong_monthly",
    approvedAt = "2021-08-21",
    status = "approved",
    note = "note",
    month = 8,
    year = 2021,
  }) {
    const jsonData = JSON.stringify(data);
    const query = {
      text: "INSERT INTO agg_report_data(id, jorong_id, midwife_id, approved_by, data, report_type, approved_at, status, note, month, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11)",
      values: [
        id,
        jorongId,
        midwifeId,
        approvedBy,
        jsonData,
        reportType,
        approvedAt,
        status,
        note,
        month,
        year,
      ],
    };

    await pool.query(query);
  },

  // find report by id
  async findReportById(id) {
    const query = {
      text: "SELECT * FROM agg_report_data WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE agg_report_data");
  },
};

module.exports = ReportTableTestHelper;