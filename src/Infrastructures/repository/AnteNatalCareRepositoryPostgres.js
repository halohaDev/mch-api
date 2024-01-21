const AnteNatalCareRepository = require("../../Domains/ante_natal/AnteNatalCareRepository");
const AnteNatalCareQuery = require("../queries/AnteNatalCareQuery");

class AnteNatalCareRepositoryPostgres extends AnteNatalCareRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._anteNatalCareQuery = new AnteNatalCareQuery({ pool });
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
      text: `INSERT INTO ante_natal_cares (id, contact_type, weight, height, hemoglobin, blood_pressure, fundal_height, fetal_heart_rate, usg_check_date, temprature, action, blood_type, tt_imunization, protein_in_urine, blood_sugar, hbsag, hiv, syphilis, maternal_history_id, upper_arm_circumference, midwife_id, jorong_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
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

    return rows[0];
  }

  async showAnteNatalCares(queryParams) {
    const queryResult = await this._anteNatalCareQuery
      .wheres(queryParams)
      .paginate();

    return queryResult;
  }
}

module.exports = AnteNatalCareRepositoryPostgres;
