const ReportRepository = require("../../Domains/report/ReportRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ReportQuery = require("../queries/ReportQuery");

class ReportRepositoryPostgres extends ReportRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._reportQuery = new ReportQuery({ pool });
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

  async showReport(queryParams) {
    const result = await this._reportQuery.wheres(queryParams).paginate();

    return result;
  }

  async findReportById(id) {
    const query = {
      text: "SELECT * FROM agg_report_data WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("REPORT_REPOSITORY.NOT_FOUND");
    }

    return result.rows[0];
  }

  async updateReportStatusAndNote(payload) {
    await this.findReportById(payload.id);

    const query = {
      text: "UPDATE agg_report_data SET note = $1, status = $2 WHERE id = $3 RETURNING id",
      values: [payload.note, payload.status, payload.id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReportRepositoryPostgres;
