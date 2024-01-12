const AnteNatalCareRepository = require("../../Domains/ante_natal/AnteNatalCareRepository");

class AnteNatalCareRepositoryPostgres extends AnteNatalCareRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addAnteNatalCare(payload) {
    const {
      placementId,
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
      sugarInUrine,
      hbsag,
      hiv,
      syphilis,
      maternalHistoryId,
    } = payload;

    const id = `anc-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO ante_natal_cares(id, placement_id, contact_type, weight, height, hemoglobin, blood_pressure, fundal_height, fetal_heart_rate, usg_check_date, temprature, action, blood_type, tt_imunization, protein_in_urine, sugar_in_urine, hbsag, hiv, syphilis, maternal_history_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *",
      values: [
        id,
        placementId,
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
        sugarInUrine,
        hbsag,
        hiv,
        syphilis,
        maternalHistoryId,
      ],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }
}

module.exports = AnteNatalCareRepositoryPostgres;
