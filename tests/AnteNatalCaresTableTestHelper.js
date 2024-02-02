/* instanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const {
  randomNumber,
  randomFromArray,
  randomDate,
} = require("../src/Commons/helper");

const AnteNatalCaresTableTestHelper = {
  // add ante natal care
  async addAnteNatalCare({
    id = "ante-natal-care-123",
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
    bloodSugar = "100",
    hbsag = "negative",
    hiv = "negative",
    syphilis = "negative",
    maternalHistoryId = "maternal-history-123",
    jorongId = "jorong-123",
    midwifeId = "user-123",
    upperArmCircumference = 10,
    createdAt = "2021-08-21",
  }) {
    const query = {
      text: `INSERT INTO ante_natal_cares (
        id, weight, height, hemoglobin, blood_pressure, fundal_height, fetal_heart_rate, usg_check_date, temprature, action, blood_type, tt_imunization, contact_type, protein_in_urine, blood_sugar, hbsag, hiv, syphilis, maternal_history_id, jorong_id, midwife_id, upper_arm_circumference, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )`,
      values: [
        id,
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
        bloodSugar,
        hbsag,
        hiv,
        syphilis,
        maternalHistoryId,
        jorongId,
        midwifeId,
        upperArmCircumference,
        createdAt,
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
  async createManyAnteNatalCare(number) {
    for (let i = 0; i < number; i++) {
      await this.addAnteNatalCare({
        id: `ante-natal-care-${i}`,
      });
    }
  },

  // create ante natal care with random gen for contact
  async createAnteNatalCareWithRandomContact(
    totalIndex,
    startDate,
    endDate,
    contactType,
    uniqueId
  ) {
    let randomWeights = [];
    let randomHeights = [];
    let randomUpperArmCircumferences = [];
    let randomSyphilis = [];
    let randomHiv = [];
    let randomHb = [];
    let randomBloodPressure = [];
    let randomBloodType = [];
    let randomTtImunization = [];
    let randomFundalHeight = [];
    let randomFetalHeartRate = [];
    let randomBloodSugar = [];
    let randomProteinInUrine = [];
    let randomHbsag = [];
    let randomTemprature = [];
    let randomAction = [];
    let randomUsgCheckDate = [];

    for (let i = 0; i < totalIndex; i++) {
      const upperArmCircumference = randomNumber(20, 30);
      const weight = randomNumber(50, 90);
      const bloodPressure = randomNumber(80, 120);
      const fundalHeight = randomNumber(20, 30);
      const fetalHeartRate = randomNumber(80, 120);
      const bloodSugar = randomNumber(80, 150);
      const proteinInUrine = randomFromArray(["negative", "positive"]);
      const hbsag = randomFromArray(["negative", "positive"]);
      const hiv = randomFromArray(["negative", "positive"]);
      const syphilis = randomFromArray(["negative", "positive"]);
      const bloodType = randomFromArray(["A", "B", "AB", "O"]);
      const ttImunization = randomFromArray(["1", "2", "3"]);
      const temprature = randomNumber(35, 37);
      const action = randomFromArray(["check", "give", "refer"]);
      const usgCheckDate = randomDate(startDate, endDate);
      randomTemprature.push(temprature);
      randomAction.push(action);
      randomUsgCheckDate.push(usgCheckDate);
      randomProteinInUrine.push(proteinInUrine);
      randomUpperArmCircumferences.push(upperArmCircumference);
      randomWeights.push(weight);
      randomBloodPressure.push(bloodPressure);
      randomFundalHeight.push(fundalHeight);
      randomFetalHeartRate.push(fetalHeartRate);
      randomBloodSugar.push(bloodSugar);
      randomHbsag.push(hbsag);
      randomHiv.push(hiv);
      randomSyphilis.push(syphilis);
      randomBloodType.push(bloodType);
      randomTtImunization.push(ttImunization);
      randomHeights.push(randomNumber(150, 180));
      randomHb.push(randomNumber(10, 15));

      await addAnteNatalCare({
        id: `ante-natal-care-${contactType}-${i}${uniqueId}`,
        maternalHistoryId: `maternal-history-${i}`,
        contactType: "c6",
        upperArmCircumference: upperArmCircumference,
        weight: weight,
        bloodPressure: bloodPressure,
        fundalHeight: fundalHeight,
        fetalHeartRate: fetalHeartRate,
        bloodSugar: bloodSugar,
        createdAt: randomDate(startDate, endDate),
        proteinInUrine: proteinInUrine,
        hbsag: hbsag,
        hiv: hiv,
        syphilis: syphilis,
        bloodType: bloodType,
        ttImunization: ttImunization,
        height: randomNumber(150, 180),
        hemoglobin: randomNumber(10, 15),
        temprature: temprature,
        action: action,
        usgCheckDate: usgCheckDate,
      });
    }

    return {
      randomWeights,
      randomHeights,
      randomUpperArmCircumferences,
      randomSyphilis,
      randomHiv,
      randomHb,
      randomBloodPressure,
      randomBloodType,
      randomTtImunization,
      randomFundalHeight,
      randomFetalHeartRate,
      randomBloodSugar,
      randomProteinInUrine,
      randomHbsag,
      randomTemprature,
      randomAction,
      randomUsgCheckDate,
    };
  },

  // clean tabletest helper using truncate
  async cleanTable() {
    await pool.query("TRUNCATE TABLE ante_natal_cares");
  },
};

module.exports = AnteNatalCaresTableTestHelper;
