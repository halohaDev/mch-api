const pool = require("../../database/postgres/pool");
const ReportsTableTestHelper = require("../../../../tests/ReportTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCareTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const ReportTableTestHelper = require("../../../../tests/ReportTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const {
  randomNumber,
  randomFromArray,
  randomDate,
} = require("../../../Commons/helper");

describe("HTTP server - reports", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AnteNatalCareTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await ReportsTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "midwife-123" });
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-345" });
  });

  describe("when POST /api/v1/reports", () => {
    it("should response 201 and persisted report", async () => {
      // Arrange
      const requestPayload = {
        jorongId: "jorong-123",
        midwifeId: "midwife-123",
        month: 1,
        year: 2021,
        data: {
          hemoglobinCheck: 1,
          anemiaBetween8And11: 2,
          anemiaLessThan8: 3,
          lilaCheck: 4,
          kek: 5,
          proteInUrineCheck: 6,
          proteInUrinePositive: 7,
          bloodSugarCheck: 8,
          bloodSugarMoreThan140: 9,
          comeWithHivPositive: 10,
          hivCheck: 11,
          hivPositive: 12,
          offeredHivTest: 12,
          gotArt: 13,
          vaginalDeliveryHivPositive: 14,
          abdominalDeliveryHivPositive: 15,
          syphilisCheck: 16,
          syphilisPositive: 17,
          hepatitisCheck: 18,
          hepatitisPositive: 19,
        },
        reportType: "anc_jorong_monthly",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/reports",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toBeDefined();

      const report = await ReportsTableTestHelper.findReportById(
        responseJson.data.id
      );
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/reports",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when GET /api/v1/reports", () => {
    beforeEach(async () => {
      await ReportsTableTestHelper.addReport({
        id: "report-123",
        jorongId: "jorong-123",
      });
      await ReportsTableTestHelper.addReport({
        id: "report-456",
        month: "12",
        year: "2020",
      });
      await ReportsTableTestHelper.addReport({
        id: "report-789",
        jorongId: "jorong-345",
      });
    });

    it("should response 200 and return all reports", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/reports",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.data).toHaveLength(3);
    });

    it("should response 200 and return filtered reports by jorongId", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/reports?jorongId=jorong-345",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.data).toHaveLength(1);
    });

    it("should response 200 and return filtered reports by month & year", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/reports?month=12&year=2020",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.data).toHaveLength(1);
    });
  });

  describe("when GET /api/v1/reports/calculate/{reportType}", () => {
    describe("when reportType is anc-monthly-jorong", () => {
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

      beforeEach(async () => {
        // Arrange
        // create 20 users
        for (let i = 0; i < 20; i++) {
          await UsersTableTestHelper.addUser({
            id: `user-ibu-${i}`,
            role: "mother",
          });
        }

        // create 20 maternal
        for (let i = 0; i < 20; i++) {
          await MaternalTableTestHelper.addMaternal({
            id: `maternal-${i}`,
            userId: `user-ibu-${i}`,
          });
        }

        // create 20 maternal history
        for (let i = 0; i < 20; i++) {
          await MaternalHistoryTableTestHelper.addMaternalHistory({
            id: `maternal-history-${i}`,
            maternalId: `maternal-${i}`,
            maternalStatus: "pregnant",
          });
        }

        const startDate = new Date("2021-08-01");
        const endDate = new Date("2021-08-31");

        // create 10 ante natal care c1
        for (let i = 0; i < 10; i++) {
          const weight = randomNumber(50, 90);
          const height = randomNumber(150, 180);
          const upperArmCircumference = randomNumber(20, 30);
          const syphilis = randomFromArray(["positive", "negative"]);
          const hiv = randomFromArray([
            "positive",
            "negative",
            "positive_non_test",
            "rejected",
          ]);
          const hb = randomNumber(7, 15);
          const bloodPressure = randomNumber(80, 120);
          const bloodType = randomFromArray(["A", "B", "AB", "O"]);
          const ttImunization = randomFromArray(["1", "2", "3", "4"]);
          const fundalHeight = randomNumber(20, 30);
          const fetalHeartRate = randomNumber(80, 120);
          const usgCheckDate = new Date();

          randomWeights.push(weight);
          randomHeights.push(height);
          randomUpperArmCircumferences.push(upperArmCircumference);
          randomSyphilis.push(syphilis);
          randomHiv.push(hiv);
          randomHb.push(hb);
          randomBloodPressure.push(bloodPressure);
          randomBloodType.push(bloodType);
          randomTtImunization.push(ttImunization);
          randomFundalHeight.push(fundalHeight);
          randomFetalHeartRate.push(fetalHeartRate);

          await AnteNatalCareTableTestHelper.addAnteNatalCare({
            id: `ante-natal-care-c1-${i}`,
            maternalHistoryId: `maternal-history-${i}`,
            contactType: "c1",
            weight: weight,
            height: height,
            upperArmCircumference: upperArmCircumference,
            syphilis: syphilis,
            hiv: hiv,
            hemoglobin: hb,
            bloodPressure: bloodPressure,
            bloodType: bloodType,
            ttImunization: ttImunization,
            fundalHeight: fundalHeight,
            fetalHeartRate: fetalHeartRate,
            usgCheckDate: usgCheckDate,
            createdAt: randomDate(startDate, endDate),
            proteinInUrine: null,
            bloodSugar: null,
            hbsag: null,
          });
        }

        // create 10 ante natal care c6
        for (let i = 10; i < 20; i++) {
          const upperArmCircumference = randomNumber(20, 30);
          const weight = randomNumber(50, 90);
          const bloodPressure = randomNumber(80, 120);
          const fundalHeight = randomNumber(20, 30);
          const fetalHeartRate = randomNumber(80, 120);
          const bloodSugar = randomNumber(80, 150);

          randomUpperArmCircumferences.push(upperArmCircumference);
          randomWeights.push(weight);
          randomBloodPressure.push(bloodPressure);
          randomFundalHeight.push(fundalHeight);
          randomFetalHeartRate.push(fetalHeartRate);
          randomBloodSugar.push(bloodSugar);

          await AnteNatalCareTableTestHelper.addAnteNatalCare({
            id: `ante-natal-care-c2-${i}`,
            maternalHistoryId: `maternal-history-${i}`,
            contactType: "c6",
            upperArmCircumference: upperArmCircumference,
            weight: weight,
            bloodPressure: bloodPressure,
            fundalHeight: fundalHeight,
            fetalHeartRate: fetalHeartRate,
            bloodSugar: bloodSugar,
            createdAt: randomDate(startDate, endDate),
            proteinInUrine: null,
            syphilis: null,
            hiv: null,
            hb: null,
            bloodType: null,
            ttImunization: null,
            usgCheckDate: null,
            hbsag: null,
            hemoglobin: null,
          });
        }
      });

      it("should response 200 and return calculated result", async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: "GET",
          url: "/api/v1/reports/calculate/anc-monthly-jorong?jorongId=jorong-123&month=8&year=2021",
        });

        // Assert
        const responseJson = JSON.parse(response.payload);

        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual("success");
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.hemoglobin_check).toEqual(randomHb.length);
        expect(responseJson.data.anemia_less_than_8).toEqual(
          randomHb.filter((hb) => hb < 8).length
        );
        expect(responseJson.data.anemia_between_8_and_11).toEqual(
          randomHb.filter((hb) => hb >= 8 && hb <= 11.9).length
        );
        expect(responseJson.data.lila_check).toEqual(
          randomUpperArmCircumferences.length
        );
        expect(responseJson.data.kek).toEqual(
          randomUpperArmCircumferences.filter((uac) => uac < 23).length
        );
        expect(responseJson.data.protein_in_urine_check).toEqual(0);
        expect(responseJson.data.protein_in_urine_positive).toEqual(0);
        expect(responseJson.data.blood_sugar_check).toEqual(
          randomBloodSugar.length
        );
        expect(responseJson.data.blood_sugar_more_than_140).toEqual(
          randomBloodSugar.filter((bs) => bs > 140).length
        );
        expect(responseJson.data.come_with_hiv_positive).toEqual(
          randomHiv.filter((hiv) => hiv === "positive_non_test").length
        );
        expect(responseJson.data.hiv_check).toEqual(
          randomHiv.filter((hiv) => hiv === "positive" || hiv === "negative")
            .length
        );
        expect(responseJson.data.hiv_positive).toEqual(
          randomHiv.filter((hiv) => hiv === "positive").length
        );
        expect(responseJson.data.offered_hiv_test).toEqual(
          randomHiv.filter(
            (hiv) =>
              hiv === "rejected" || hiv === "positive" || hiv === "negative"
          ).length
        );
        expect(responseJson.data.hepatitis_check).toEqual(0);
        expect(responseJson.data.hepatitis_positive).toEqual(0);
        expect(responseJson.data.syphilis_check).toEqual(randomSyphilis.length);
        expect(responseJson.data.syphilis_positive).toEqual(
          randomSyphilis.filter((syphilis) => syphilis === "positive").length
        );
        expect(responseJson.data.got_art).toEqual(0);
      });
    });

    describe("when reportType is anc-monthly-puskesmas", () => {
      let hemoglobin_check = 0;
      let anemia_less_than_8 = 0;
      let anemia_between_8_and_11 = 0;
      let lila_check = 0;
      let kek = 0;
      let protein_in_urine_check = 0;
      let protein_in_urine_positive = 0;
      let blood_sugar_check = 0;
      let blood_sugar_more_than_140 = 0;
      let come_with_hiv_positive = 0;
      let hiv_check = 0;
      let hiv_positive = 0;
      let offered_hiv_test = 0;
      let hepatitis_check = 0;
      let hepatitis_positive = 0;
      let syphilis_check = 0;
      let syphilis_positive = 0;
      let got_art = 0;

      beforeEach(async () => {
        for (let i = 0; i < 5; i++) {
          const randomHemoglobinCheck = randomNumber(1, 10);
          const randomAnemiaLessThan8 = randomNumber(1, 10);
          const randomAnemiaBetween8And11 = randomNumber(1, 10);
          const randomLilaCheck = randomNumber(1, 10);
          const randomKek = randomNumber(1, 10);
          const randomProteinInUrineCheck = randomNumber(1, 10);
          const randomProteinInUrinePositive = randomNumber(1, 10);
          const randomBloodSugarCheck = randomNumber(1, 10);
          const randomBloodSugarMoreThan140 = randomNumber(1, 10);
          const randomComeWithHivPositive = randomNumber(1, 10);
          const randomHivCheck = randomNumber(1, 10);
          const randomHivPositive = randomNumber(1, 10);
          const randomOfferedHivTest = randomNumber(1, 10);
          const randomHepatitisCheck = randomNumber(1, 10);
          const randomHepatitisPositive = randomNumber(1, 10);
          const randomSyphilisCheck = randomNumber(1, 10);
          const randomSyphilisPositive = randomNumber(1, 10);
          const randomGotArt = randomNumber(1, 10);

          hemoglobin_check += randomHemoglobinCheck;
          anemia_less_than_8 += randomAnemiaLessThan8;
          anemia_between_8_and_11 += randomAnemiaBetween8And11;
          lila_check += randomLilaCheck;
          kek += randomKek;
          protein_in_urine_check += randomProteinInUrineCheck;
          protein_in_urine_positive += randomProteinInUrinePositive;
          blood_sugar_check += randomBloodSugarCheck;
          blood_sugar_more_than_140 += randomBloodSugarMoreThan140;
          come_with_hiv_positive += randomComeWithHivPositive;
          hiv_check += randomHivCheck;
          hiv_positive += randomHivPositive;
          offered_hiv_test += randomOfferedHivTest;
          hepatitis_check += randomHepatitisCheck;
          hepatitis_positive += randomHepatitisPositive;
          syphilis_check += randomSyphilisCheck;
          syphilis_positive += randomSyphilisPositive;
          got_art += randomGotArt;

          await ReportTableTestHelper.addReport({
            id: `report-${i}-jorong-${i}`,
            midwifeId: "midwife-123",
            jorongId: null,
            data: {
              hemoglobin_check: randomHemoglobinCheck,
              anemia_less_than_8: randomAnemiaLessThan8,
              anemia_between_8_and_11: randomAnemiaBetween8And11,
              lila_check: randomLilaCheck,
              kek: randomKek,
              protein_in_urine_check: randomProteinInUrineCheck,
              protein_in_urine_positive: randomProteinInUrinePositive,
              blood_sugar_check: randomBloodSugarCheck,
              blood_sugar_more_than_140: randomBloodSugarMoreThan140,
              come_with_hiv_positive: randomComeWithHivPositive,
              hiv_check: randomHivCheck,
              hiv_positive: randomHivPositive,
              offered_hiv_test: randomOfferedHivTest,
              hepatitis_check: randomHepatitisCheck,
              hepatitis_positive: randomHepatitisPositive,
              syphilis_check: randomSyphilisCheck,
              syphilis_positive: randomSyphilisPositive,
              got_art: randomGotArt,
            },
            month: 8,
            year: 2021,
            reportType: "anc_jorong_monthly",
            status: "approved",
          });
        }
      });

      it("should response 200 and return calculated result", async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: "GET",
          url: "/api/v1/reports/calculate/anc-monthly-puskesmas?month=8&year=2021",
        });

        // Assert
        const responseJson = JSON.parse(response.payload);

        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual("success");
        expect(responseJson.data.hemoglobin_check).toEqual(hemoglobin_check);
        expect(responseJson.data.anemia_less_than_8).toEqual(
          anemia_less_than_8
        );
        expect(responseJson.data.anemia_between_8_and_11).toEqual(
          anemia_between_8_and_11
        );
        expect(responseJson.data.lila_check).toEqual(lila_check);
        expect(responseJson.data.kek).toEqual(kek);
        expect(responseJson.data.protein_in_urine_check).toEqual(
          protein_in_urine_check
        );
        expect(responseJson.data.protein_in_urine_positive).toEqual(
          protein_in_urine_positive
        );
        expect(responseJson.data.blood_sugar_check).toEqual(blood_sugar_check);
        expect(responseJson.data.blood_sugar_more_than_140).toEqual(
          blood_sugar_more_than_140
        );
        expect(responseJson.data.come_with_hiv_positive).toEqual(
          come_with_hiv_positive
        );
        expect(responseJson.data.hiv_check).toEqual(hiv_check);
        expect(responseJson.data.hiv_positive).toEqual(hiv_positive);
        expect(responseJson.data.offered_hiv_test).toEqual(offered_hiv_test);
        expect(responseJson.data.hepatitis_check).toEqual(hepatitis_check);
        expect(responseJson.data.hepatitis_positive).toEqual(
          hepatitis_positive
        );
        expect(responseJson.data.syphilis_check).toEqual(syphilis_check);
        expect(responseJson.data.syphilis_positive).toEqual(syphilis_positive);
        expect(responseJson.data.got_art).toEqual(got_art);
      });
    });
  });

  describe("when PATCH /api/v1/reports/{id}/status", () => {
    it("should response 200 and update status", async () => {
      // Arrange
      await ReportsTableTestHelper.addReport({
        id: "report-123",
        jorongId: "jorong-123",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PATCH",
        url: "/api/v1/reports/report-123/status",
        payload: {
          status: "approved",
          note: "note",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      const report = await ReportsTableTestHelper.findReportById("report-123");
      expect(report.status).toEqual("approved");
    });
  });
});
