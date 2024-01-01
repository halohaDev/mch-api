/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const AnteNatalCaresTableTestHelper = {
  // add ante natal care
  async addAnteNatalCare({
    id = "ante-natal-care-123",
    placementId = "placement-123",
    weight = 50,
    height = 160,
    hemoglobin = 12,
    bloodPressure = 120,
    fundalHeight = 10,
    fetalHeartRate = 120,
    usgCheckDate = "2021-08-21",
    temprature = 36,
    action = "check",
    bloodType = "A",
    ttImunization = "1",
    contactType = "c1",
    proteinInUrine = "negative",
    sugarInUrine = "negative",
    hbsag = "negative",
    hiv = "negative",
    syphilis = "negative",
  }) {
    const query = {
      text: "INSERT INTO ante_natal_cares(id, placement_id, weight, height, hemoglobin, blood_pressure, fundal_height, fetal_heart_rate, usg_check_date, temprature, action, blood_type, tt_imunization, contact_type, protein_in_urine, sugar_in_urine, hbsag, hiv, syphilis) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 , $11, $12, $13, $14, $15, $16, $17, $18, $19)",
      values: [
        id,
        placementId,
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
        contactType,
        proteinInUrine,
        sugarInUrine,
        hbsag,
        hiv,
        syphilis,
      ],
    };

    await pool.query(query);
  },

  // find ante natal care by id
  async findAnteNatalCareById(id) {
    const query = {
      text: "SELECT * FROM ante_natal_cares WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  // create many ante natal care according to number passed
  async createManyAnteNatalCare(number, placementId) {
    for (let i = 0; i < number; i++) {
      await this.addAnteNatalCare({
        id: `ante-natal-care-${i}`,
        placementId,
      });
    }
  },

  // clean tabletest helper using truncate
  async cleanTable() {
    await pool.query("TRUNCATE TABLE ante_natal_cares");
  },
};
