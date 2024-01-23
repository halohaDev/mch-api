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

  async calculateAnteNatalCareReport(queryParams) {
    const { jorongId, startDate, endDate } = queryParams;

    const selectQuery = `
      SELECT 
        COUNT(DISTINCT CASE WHEN hemoglobin < 8 THEN maternal_history_id END)::integer AS anemia_less_than_8,
        COUNT(DISTINCT CASE WHEN hemoglobin >= 8 AND hemoglobin <= 11.9 THEN maternal_history_id END)::integer AS anemia_between_8_and_11,
        COUNT(DISTINCT CASE WHEN hemoglobin IS NOT NULL THEN maternal_history_id END)::integer AS hemoglobin_check,
        COUNT(DISTINCT CASE WHEN protein_in_urine = 'positive' THEN maternal_history_id END)::integer AS protein_in_urine_positive,
        COUNT(DISTINCT CASE WHEN protein_in_urine IS NOT NULL THEN maternal_history_id END)::integer AS protein_in_urine_check,
        COUNT(DISTINCT CASE WHEN blood_sugar > 140 THEN maternal_history_id END)::integer AS blood_sugar_more_than_140,
        COUNT(DISTINCT CASE WHEN blood_sugar IS NOT NULL THEN maternal_history_id END)::integer AS blood_sugar_check,
        COUNT(DISTINCT CASE WHEN hiv = 'positive_non_test' THEN maternal_history_id END)::integer AS come_with_hiv_positive,
        COUNT(DISTINCT CASE WHEN hiv = 'positive' THEN maternal_history_id END)::integer AS hiv_positive,
        COUNT(DISTINCT CASE WHEN hiv = 'rejected' OR hiv = 'positive' OR hiv = 'rejected' OR hiv = 'negative' THEN maternal_history_id END)::integer AS offered_hiv_test,
        COUNT(DISTINCT CASE WHEN hiv = 'positive' OR hiv = 'negative' THEN maternal_history_id END)::integer AS hiv_check,
        COUNT(DISTINCT CASE WHEN hbsag = 'positive' THEN maternal_history_id END)::integer AS hepatitis_positive,
        COUNT(DISTINCT CASE WHEN hbsag IS NOT NULL THEN maternal_history_id END)::integer AS hepatitis_check,
        COUNT(DISTINCT CASE WHEN syphilis = 'positive' THEN maternal_history_id END)::integer AS syphilis_positive,
        COUNT(DISTINCT CASE WHEN syphilis IS NOT NULL THEN maternal_history_id END)::integer AS syphilis_check,
        COUNT(DISTINCT CASE WHEN upper_arm_circumference IS NOT NULL THEN maternal_history_id END)::integer AS lila_check,
        COUNT(DISTINCT CASE WHEN upper_arm_circumference < 23 THEN maternal_history_id END)::integer AS kek,
        COUNT(DISTINCT CASE WHEN art_given = true THEN maternal_history_id END)::integer AS got_art
      FROM ante_natal_cares
    `;

    let indexWhere = 0;
    const jorongCondition = jorongId
      ? `WHERE ante_natal_cares.jorong_id = $${++indexWhere}`
      : "";
    const dateCondition =
      startDate && endDate
        ? `AND ante_natal_cares.created_at BETWEEN $${++indexWhere} AND $${++indexWhere}`
        : "";

    const query = {
      text: `
        ${selectQuery}
        ${jorongCondition}
        ${dateCondition}
        GROUP BY ante_natal_cares.jorong_id
      `,
      values: [jorongId, startDate, endDate],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ReportRepositoryPostgres;
