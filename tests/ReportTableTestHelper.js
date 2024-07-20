/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const { snakeToCamelObject } = require("../src/Commons/helper");

const ReportTableTestHelper = {
  // add report
  async addReport({
    id = "report-123",
    requesterId = "midwife-123",
    jorongId = "jorong-123",
    approvedBy = null,
    data = {},
    reportType = "jorong_monthly",
    approvedAt = "2021-08-21",
    status = "approved",
    note = "note",
    month = 8,
    year = 2021,
  }) {
    const jsonData = JSON.stringify(data);
    const query = {
      text: "INSERT INTO reports(id, jorong_id, requested_by, approved_by, aggregated_data, report_type, approved_at, status, note, month, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11)",
      values: [id, jorongId, requesterId, approvedBy, jsonData, reportType, approvedAt, status, note, month, year],
    };

    await pool.query(query);
  },

  // find report by id
  async findReportById(id) {
    const query = {
      text: "SELECT * FROM reports WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return snakeToCamelObject(result.rows[0]);
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE reports");
  },
};

module.exports = ReportTableTestHelper;
