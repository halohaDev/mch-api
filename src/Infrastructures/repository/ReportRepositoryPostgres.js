const ReportRepository = require("../../Domains/report/ReportRepository");

class ReportRepositoryPostgres extends ReportRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReport(payload) {
    const { data } = payload;
    const id = `report-${this._idGenerator()}`;
    const jsonData = JSON.stringify(data);
    const query = {
      text: "INSERT INTO agg_report_data(id, jorong_id, midwife_id, approved_by, data, report_type, approved_at, status, note, month, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11) RETURNING id",
      values: [
        id,
        payload.jorongId,
        payload.midwifeId,
        payload.approvedBy,
        jsonData,
        payload.reportType,
        payload.approvedAt,
        payload.status,
        payload.note,
        payload.month,
        payload.year,
      ],
    };

    await this._pool.query(query);

    return id;
  }

  async showReport(payload) {}

  async findReportById(id) {}

  async updateReport(payload) {}
}

module.exports = ReportRepositoryPostgres;
