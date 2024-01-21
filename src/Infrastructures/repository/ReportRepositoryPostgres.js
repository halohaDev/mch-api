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
        COUNT(DISTINCT CASE WHEN hemoglobin < 8 THEN maternal_histories.id END) AS anemiaLessThan8,
        COUNT(DISTINCT CASE WHEN hemoglobin >= 8 AND hemoglobin <= 11.9 THEN maternal_histories.id END) AS anemia8And11,
        COUNT(DISTINCT CASE WHEN hemoglobin IS NOT NULL THEN maternal_histories.id END) AS hemoglobinCheck,
        COUNT(DISTINCT CASE WHEN protein_in_urine = 'positive' THEN maternal_histories.id END) AS proteinInUrinePositive,
        COUNT(DISTINCT CASE WHEN protein_in_urine IS NOT NULL THEN maternal_histories.id END) AS proteinInUrineCheck,
        COUNT(DISTINCT CASE WHEN sugar_in_urine = 'positive' THEN maternal_histories.id END) AS bloodSugarMoreThan140,
        COUNT(DISTINCT CASE WHEN sugar_in_urine IS NOT NULL THEN maternal_histories.id END) AS bloodSugarCheck,
        COUNT(DISTINCT CASE WHEN hiv = 'positive' THEN maternal_histories.id END) AS comeWithHivPositive,
        COUNT(DISTINCT CASE WHEN hiv IS NOT NULL THEN maternal_histories.id END) AS hivCheck,
        COUNT(DISTINCT CASE WHEN hbsag = 'positive' THEN maternal_histories.id END) AS hepatitisPositive,
        COUNT(DISTINCT CASE WHEN hbsag IS NOT NULL THEN maternal_histories.id END) AS hepatitisCheck,
        COUNT(DISTINCT CASE WHEN syphilis = 'positive' THEN maternal_histories.id END) AS syphilisPositive,
        COUNT(DISTINCT CASE WHEN syphilis IS NOT NULL THEN maternal_histories.id END) AS syphilisCheck
      FROM ante_natal_cares
    `;

    let indexWhere = 0;
    const jorongCondition = jorongId
      ? `WHERE maternal_histories.jorong_id = $'${++indexWhere}'`
      : "";
    const dateCondition =
      startDate && endDate
        ? `AND maternal_histories.created_at BETWEEN $'${++indexWhere}' AND $'${++indexWhere}'`
        : "";

    const query = {
      text: `
        ${selectQuery}
        INNER JOIN maternal_histories ON maternal_histories.id = ante_natal_cares.maternal_history_id
        ${jorongCondition}
        ${dateCondition}
        GROUP BY maternal_histories.id
      `,
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async calculateAnteNatalCareReport(queryParams) {}
}

module.exports = ReportRepositoryPostgres;
