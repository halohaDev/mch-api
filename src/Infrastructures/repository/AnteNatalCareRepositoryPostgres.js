const AnteNatalCareRepository = require("../../Domains/ante_natal/AnteNatalCareRepository");
const AnteNatalCareQuery = require("../queries/AnteNatalCareQuery");

class AnteNatalCareRepositoryPostgres extends AnteNatalCareRepository {
  constructor(pool, idGenerator, moment, snakeToCamelCase) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._moment = moment;
    this._anteNatalCareQuery = new AnteNatalCareQuery({ pool });
    this._snakeToCamelCase = snakeToCamelCase;
  }

  async addAnteNatalCare(payload) {
    const {
      contactType,
      weight,
      height,
      hemoglobin,
      bloodPressure,
      fundalHeight,
      fetalHeartRate,
      usgCheckDate,
      temprature,
      action,
      bloodType,
      ttImunization,
      proteinInUrine,
      bloodSugar,
      hbsag,
      hiv,
      syphilis,
      maternalHistoryId,
      upperArmCircumference,
      midwifeId,
      jorongId,
    } = payload;

    const id = `anc-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO ante_natal_cares (id, contact_type, weight, height, hemoglobin, blood_pressure, fundal_height, fetal_heart_rate, usg_check_date, temprature, action, blood_type, tt_imunization, protein_in_urine, blood_sugar, hbsag, hiv, syphilis, maternal_history_id, upper_arm_circumference, midwife_id, jorong_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
      values: [
        id,
        contactType,
        weight,
        height,
        hemoglobin,
        bloodPressure,
        fundalHeight,
        fetalHeartRate,
        usgCheckDate,
        temprature,
        action,
        bloodType,
        ttImunization,
        proteinInUrine,
        bloodSugar,
        hbsag,
        hiv,
        syphilis,
        maternalHistoryId,
        upperArmCircumference,
        midwifeId,
        jorongId,
      ],
    };

    const { rows } = await this._pool.query(query);

    return this._snakeToCamelCase(rows[0]);
  }

  async showAnteNatalCares(queryParams) {
    const params = this._buildQueryParams(queryParams);

    const queryResult = await this._anteNatalCareQuery.wheres(params).paginate();

    queryResult.data = this._snakeToCamelCase(queryResult.data);
    return queryResult;
  }

  _buildQueryParams(queryParams) {
    if (queryParams === undefined) {
      return {};
    }

    const dateRanges = this._getStartDateEndEndDate(queryParams.month, queryParams.year);

    if (dateRanges) {
      const { startDate, endDate } = dateRanges;

      // parsing date to string
      queryParams.dateOfVisitBiggerThan = startDate.toISOString();
      queryParams.dateOfVisitSmallerThan = endDate.toISOString();
    }

    return queryParams;
  }

  _getStartDateEndEndDate(month, year) {
    if (!month && !year) {
      return;
    }

    if (!month && year) {
      const startDate = this._moment(`${year}-01-01`, "YYYY-MM-DD").startOf("year").toDate();

      const endDate = this._moment(startDate).endOf("year").toDate();

      return { startDate, endDate };
    }

    const startDate = this._moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf("month").toDate();

    const endDate = this._moment(startDate).endOf("month").toDate();

    return { startDate, endDate };
  }
}

module.exports = AnteNatalCareRepositoryPostgres;
