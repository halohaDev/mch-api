const ReportRepositoryPostgres = require("../ReportRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const ReportTableTestHelper = require("../../../../tests/ReportTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCareTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const PostNatalCareTableTestHelper = require("../../../../tests/PostNatalCareTableTestHelper");
const { randomNumber, randomFromArray, randomDate, snakeToCamelObject } = require("../../../Commons/helper");
const MaternalComplicationsTableTestHelper = require("../../../../tests/MaternalComplicationsTableTestHelper");
const ChildrenTableTestHelper = require("../../../../tests/ChildrenTableTestHelper");

describe("ReportRepository postgres implementation", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ReportTableTestHelper.cleanTable();
    await MaternalComplicationsTableTestHelper.cleanTable();
    await PostNatalCareTableTestHelper.cleanTable();
    await AnteNatalCareTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "midwife-123", role: "midwife" });
    await UsersTableTestHelper.addUser({
      id: "coordinator-123",
      role: "coordinator",
    });

    await UsersTableTestHelper.addUser({
      id: "user-123",
      role: "midwife",
    });

    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
  });

  describe("addReport function", () => {
    it("should persist report and return id", async () => {
      // Arrange
      const mockIdGenerator = () => "123";
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, mockIdGenerator);

      // Action
      await reportRepositoryPostgres.addReport({
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "anc_jorong_monthly",
        approvedAt: "2021-08-21",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
      });

      // Assert
      const report = await ReportTableTestHelper.findReportById("report-123");

      expect(report).toBeDefined();
      expect(report.id).toBe("report-123");
      expect(report.midwife_id).toBe("midwife-123");
      expect(report.jorong_id).toBe("jorong-123");
      expect(report.approved_by).toBe("coordinator-123");
      expect(report.data).toEqual({ cobaMasukanData: "data" });
      expect(report.report_type).toBe("anc_jorong_monthly");
      expect(report.approved_at).toBeDefined();
      expect(report.status).toBe("approved");
      expect(report.note).toBe("note");
      expect(report.month).toBe(8);
      expect(report.year).toBe(2021);
      expect(report.created_at).toBeDefined();
      expect(report.updated_at).toBeDefined();
    });
  });

  describe("findReportById function", () => {
    it("should throw NotFoundError when report not found", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(reportRepositoryPostgres.findReportById("report-123")).rejects.toThrowError(NotFoundError);
    });

    it("should return report when report is found", async () => {
      // Arrange
      await ReportTableTestHelper.addReport({
        id: "report-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "anc_jorong_monthly",
        approvedAt: "2021-08-21",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
      });
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // Action
      const report = await reportRepositoryPostgres.findReportById("report-123");

      // Assert
      expect(report).toStrictEqual({
        id: "report-123",
        midwife_id: "midwife-123",
        jorong_id: "jorong-123",
        approved_by: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        report_type: "anc_jorong_monthly",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        approved_at: expect.any(Date),
      });
    });
  });

  describe("updateReport function", () => {
    it("should update report", async () => {
      // Arrange
      await ReportTableTestHelper.addReport({
        id: "report-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "anc_jorong_monthly",
        approvedAt: "2021-08-21",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
      });
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // Action
      await reportRepositoryPostgres.updateReportStatusAndNote({
        id: "report-123",
        status: "revision",
        note: "note",
      });

      // Assert
      const report = await ReportTableTestHelper.findReportById("report-123");
      expect(report.status).toBe("revision");
      expect(report.note).toBe("note");
    });
  });

  describe("showReport function", () => {
    it("should return report", async () => {
      // Arrange
      await ReportTableTestHelper.addReport({
        id: "report-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "anc_jorong_monthly",
        approvedAt: "2021-08-21",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
      });

      await ReportTableTestHelper.addReport({
        id: "report-456",
        month: 9,
        year: 2021,
      });

      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // Action
      const report = await reportRepositoryPostgres.showReport({
        month: 8,
        year: 2021,
      });

      // Assert
      expect(report.data).toHaveLength(1);
      expect(report.meta.size).toBe(1);
    });
  });

  describe.skip("calculateAncReportJorongMonthly function", () => {
    it("should calculate correctly", async () => {
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

      const startDate = new Date("2021-08-01");
      const endDate = new Date("2021-08-31");

      // create 10 ante natal care c1
      for (let i = 0; i < 10; i++) {
        const weight = randomNumber(50, 90);
        const height = randomNumber(150, 180);
        const upperArmCircumference = randomNumber(20, 30);
        const syphilis = randomFromArray(["positive", "negative"]);
        const hiv = randomFromArray(["positive", "negative", "positive_non_test", "rejected"]);
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

      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // Action
      const result = await reportRepositoryPostgres.calculateAnteNatalCareJorongMonthlyReport({
        jorongId: "jorong-123",
        startDate: "2021-08-01",
        endDate: "2021-08-31",
      });

      const firstResult = result[0];

      // Assert
      expect(firstResult.hemoglobin_check).toEqual(randomHb.length);
      expect(firstResult.anemia_less_than_8).toEqual(randomHb.filter((hb) => hb < 8).length);
      expect(firstResult.anemia_between_8_and_11).toEqual(randomHb.filter((hb) => hb >= 8 && hb <= 11.9).length);
      expect(firstResult.lila_check).toEqual(randomUpperArmCircumferences.length);
      expect(firstResult.kek).toEqual(randomUpperArmCircumferences.filter((uac) => uac < 23).length);
      expect(firstResult.protein_in_urine_check).toEqual(0);
      expect(firstResult.protein_in_urine_positive).toEqual(0);
      expect(firstResult.blood_sugar_check).toEqual(randomBloodSugar.length);
      expect(firstResult.blood_sugar_more_than_140).toEqual(randomBloodSugar.filter((bs) => bs > 140).length);
      expect(firstResult.come_with_hiv_positive).toEqual(randomHiv.filter((hiv) => hiv === "positive_non_test").length);
      expect(firstResult.hiv_check).toEqual(randomHiv.filter((hiv) => hiv === "positive" || hiv === "negative").length);
      expect(firstResult.hiv_positive).toEqual(randomHiv.filter((hiv) => hiv === "positive").length);
      expect(firstResult.offered_hiv_test).toEqual(
        randomHiv.filter((hiv) => hiv === "rejected" || hiv === "positive" || hiv === "negative").length
      );
      expect(firstResult.hepatitis_check).toEqual(0);
      expect(firstResult.hepatitis_positive).toEqual(0);
      expect(firstResult.syphilis_check).toEqual(randomSyphilis.length);
      expect(firstResult.syphilis_positive).toEqual(randomSyphilis.filter((syphilis) => syphilis === "positive").length);
      expect(firstResult.got_art).toEqual(0);
    });
  });

  describe.skip("calculateAnteNatalCarePuskesmasMonthlyReport function", () => {
    it("should calculate correctly", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // create 5 jorong
      for (let i = 0; i < 5; i++) {
        await JorongTableTestHelper.addJorong({ id: `jorong-${i}` });
      }

      // create report for each jorong
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
          jorongId: `jorong-${i}`,
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

      // Action
      const result = await reportRepositoryPostgres.calculateAnteNatalCarePuskesmasMonthlyReport({
        month: 8,
        year: 2021,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        anemia_less_than_8: anemia_less_than_8,
        anemia_between_8_and_11: anemia_between_8_and_11,
        hemoglobin_check: hemoglobin_check,
        protein_in_urine_positive: protein_in_urine_positive,
        protein_in_urine_check: protein_in_urine_check,
        blood_sugar_more_than_140: blood_sugar_more_than_140,
        blood_sugar_check: blood_sugar_check,
        come_with_hiv_positive: come_with_hiv_positive,
        hiv_positive: hiv_positive,
        offered_hiv_test: offered_hiv_test,
        hiv_check: hiv_check,
        hepatitis_positive: hepatitis_positive,
        hepatitis_check: hepatitis_check,
        syphilis_positive: syphilis_positive,
        syphilis_check: syphilis_check,
        lila_check: lila_check,
        kek: kek,
        got_art: got_art,
      });
    });
  });

  describe("getAnteNatalAggregateReport function", () => {
    beforeEach(async () => {
      // create 2 jorong
      await JorongTableTestHelper.addJorong({ id: "jorong-1" });
      await JorongTableTestHelper.addJorong({ id: "jorong-2" });

      // create report for each jorong
      for (let i = 0; i < 20; i++) {
        await UsersTableTestHelper.addUser({
          id: `user-ibu-${i}`,
          role: "mother",
        });
      }

      // create 15 maternal jorong 1
      for (let i = 0; i < 15; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-1",
        });
      }

      // create 5 maternal jorong 2
      for (let i = 15; i < 20; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-2",
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

      // create 10 ante natal care c1
      for (let i = 0; i < 10; i++) {
        await AnteNatalCareTableTestHelper.addAnteNatalCare({
          id: `ante-natal-care-c1-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          contactType: "c1",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }

      // create 5 other c1
      for (let i = 10; i < 15; i++) {
        await AnteNatalCareTableTestHelper.addAnteNatalCare({
          id: `ante-natal-care-c1-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          contactType: "c1",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }

      // create 6 other c1 in different month
      for (let i = 15; i < 21; i++) {
        const maternalHistoryId = i - 15;
        await AnteNatalCareTableTestHelper.addAnteNatalCare({
          id: `ante-natal-care-c1-${i}`,
          maternalHistoryId: `maternal-history-${maternalHistoryId}`,
          contactType: "c1",
          createdAt: "2021-06-01",
          dateOfVisit: "2021-06-01",
        });
      }

      // create 5 ante natal care c6 jorong 2
      // create 5 for jorong 1
      for (let i = 10; i < 20; i++) {
        await AnteNatalCareTableTestHelper.addAnteNatalCare({
          id: `ante-natal-care-c2-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          contactType: "c6",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }
    });

    it("should return report", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const startDateUtc = new Date("2021-08-01 00:00:00 +07:00").toISOString();
      const endDateUtc = new Date("2021-08-31 23:59:59 +07:00").toISOString();
      const result = await reportRepositoryPostgres.getAnteNatalAggregateReport({
        jorongId: "jorong-1",
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].totalAnc).toBe(20);
      expect(result[0].c1).toBe(15);
      expect(result[0].c2).toBe(0);
      expect(result[0].c3).toBe(0);
      expect(result[0].c4).toBe(0);
      expect(result[0].c5).toBe(0);
      expect(result[0].c6).toBe(5);
    });

    it("should return number correctly", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const startDateUtc = new Date("2021-08-01 00:00:00 +07:00").toISOString();
      const endDateUtc = new Date("2021-08-31 23:59:59 +07:00").toISOString();
      const result = await reportRepositoryPostgres.getAnteNatalAggregateReport({
        jorongId: "jorong-2",
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].totalAnc).toBe(5);
      expect(result[0].c1).toBe(0);
      expect(result[0].c2).toBe(0);
      expect(result[0].c3).toBe(0);
      expect(result[0].c4).toBe(0);
      expect(result[0].c5).toBe(0);
      expect(result[0].c6).toBe(5);
    });
  });

  describe("getPostNatalAggregateReport function", () => {
    beforeEach(async () => {
      // create 2 jorong
      await JorongTableTestHelper.addJorong({ id: "jorong-1" });
      await JorongTableTestHelper.addJorong({ id: "jorong-2" });

      // create report for each jorong
      for (let i = 0; i < 20; i++) {
        await UsersTableTestHelper.addUser({
          id: `user-ibu-${i}`,
          role: "mother",
        });
      }

      // create 15 maternal jorong 1
      for (let i = 0; i < 15; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-1",
        });
      }

      // create 5 maternal jorong 2
      for (let i = 15; i < 20; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-2",
        });
      }

      // create 20 maternal history
      for (let i = 0; i < 20; i++) {
        await MaternalHistoryTableTestHelper.addMaternalHistory({
          id: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          maternalStatus: "postpartum",
        });
      }

      // create 10 post natal care c1
      for (let i = 0; i < 10; i++) {
        await PostNatalCareTableTestHelper.addPostNatalCare({
          id: `post-natal-care-c1-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          postNatalType: "pnc_1",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }

      // create 5 other c1
      for (let i = 10; i < 15; i++) {
        await PostNatalCareTableTestHelper.addPostNatalCare({
          id: `post-natal-care-c1-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          postNatalType: "pnc_1",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }

      // create 6 other c1 in different month
      for (let i = 15; i < 21; i++) {
        const maternalHistoryId = i - 15;
        await PostNatalCareTableTestHelper.addPostNatalCare({
          id: `post-natal-care-c1-${i}`,
          maternalHistoryId: `maternal-history-${maternalHistoryId}`,
          postNatalType: "pnc_1",
          createdAt: "2021-06-01",
          dateOfVisit: "2021-06-01",
        });
      }

      // create 5 post natal care 4 jorong 2
      // create 5 for jorong 1
      for (let i = 10; i < 20; i++) {
        await PostNatalCareTableTestHelper.addPostNatalCare({
          id: `post-natal-care-c2-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          postNatalType: "pnc_4",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }
    });

    it("should return report", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const startDateUtc = new Date("2021-08-01 00:00:00 +07:00").toISOString();
      const endDateUtc = new Date("2021-08-31 23:59:59 +07:00").toISOString();
      const result = await reportRepositoryPostgres.getPostNatalAggregateReport({
        jorongId: "jorong-1",
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].totalPnc).toBe(20);
      expect(result[0].pnc1).toBe(15);
      expect(result[0].pnc2).toBe(0);
      expect(result[0].pnc3).toBe(0);
      expect(result[0].pnc4).toBe(5);
    });
  });

  describe("getMaternalComplicationsReport function", () => {
    beforeEach(async () => {
      // create 2 jorong
      await JorongTableTestHelper.addJorong({ id: "jorong-1" });
      await JorongTableTestHelper.addJorong({ id: "jorong-2" });

      // create report for each jorong
      for (let i = 0; i < 20; i++) {
        await UsersTableTestHelper.addUser({
          id: `user-ibu-${i}`,
          role: "mother",
        });
      }

      // create 15 maternal jorong 1
      for (let i = 0; i < 15; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-1",
        });
      }

      // create 5 maternal jorong 2
      for (let i = 15; i < 20; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-2",
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

      // create 10 maternal complications jorong 1
      for (let i = 0; i < 10; i++) {
        await MaternalComplicationsTableTestHelper.addMaternalComplication({
          id: `maternal-complications-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          createdAt: "2021-08-01",
        });
      }

      // create 5 other c1
      for (let i = 10; i < 15; i++) {
        await MaternalComplicationsTableTestHelper.addMaternalComplication({
          id: `maternal-complications-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          createdAt: "2021-08-01",
        });
      }

      await MaternalComplicationsTableTestHelper.addMaternalComplication({
        id: `maternal-complications-death`,
        maternalHistoryId: `maternal-history-0`,
        createdAt: "2021-08-01",
        comeCondition: "dead",
      });
    });

    it("should return report", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const startDateUtc = new Date("2021-08-01 00:00:00 +07:00").toISOString();
      const endDateUtc = new Date("2021-08-31 23:59:59 +07:00").toISOString();
      const result = await reportRepositoryPostgres.getMaternalComplicationAggregateReport({
        jorongId: "jorong-1",
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].ancComplication).toBe(15);
      expect(result[0].pncComplication).toBe(0);
      expect(result[0].ancDeath).toBe(1);
    });
  });

  describe("getRiskFactorAggregateReport function", () => {
    beforeEach(async () => {
      // create 2 jorong
      await JorongTableTestHelper.addJorong({ id: "jorong-1" });
      await JorongTableTestHelper.addJorong({ id: "jorong-2" });

      // create report for each jorong
      for (let i = 0; i < 20; i++) {
        await UsersTableTestHelper.addUser({
          id: `user-ibu-${i}`,
          role: "mother",
        });
      }

      // create 15 maternal jorong 1
      for (let i = 0; i < 15; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-1",
        });
      }

      // create 5 maternal jorong 2
      for (let i = 15; i < 20; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-2",
        });
      }

      // create 10 maternal history
      for (let i = 0; i < 5; i++) {
        await MaternalHistoryTableTestHelper.addMaternalHistory({
          id: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          maternalStatus: "pregnant",
          riskStatus: "risk",
        });
      }

      for (let i = 5; i < 7; i++) {
        await MaternalHistoryTableTestHelper.addMaternalHistory({
          id: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          maternalStatus: "pregnant",
          riskStatus: "high_risk",
        });
      }

      for (let i = 7; i < 20; i++) {
        await MaternalHistoryTableTestHelper.addMaternalHistory({
          id: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          maternalStatus: "pregnant",
          riskStatus: "normal",
        });
      }

      // create 10 anc
      for (let i = 0; i < 10; i++) {
        await AnteNatalCareTableTestHelper.addAnteNatalCare({
          id: `ante-natal-care-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          contactType: "c1",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }

      // create 10 pnc
      for (let i = 10; i < 20; i++) {
        await PostNatalCareTableTestHelper.addPostNatalCare({
          id: `post-natal-care-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          postNatalType: "pnc_1",
          createdAt: "2021-08-01",
          dateOfVisit: "2021-08-01",
        });
      }
    });

    it("should return report", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const startDateUtc = new Date("2021-08-01 00:00:00 +07:00").toISOString();
      const endDateUtc = new Date("2021-08-31 23:59:59 +07:00").toISOString();
      const result = await reportRepositoryPostgres.getRiskFactorAggregateReport({
        jorongId: "jorong-1",
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      // Assert
      expect(result).toBeDefined();
      expect(result.highRisk).toBe(2);
      expect(result.risk).toBe(5);
    });
  });

  describe("getDeliveryAggregateReport function", () => {
    beforeEach(async () => {
      // create 2 jorong
      await JorongTableTestHelper.addJorong({ id: "jorong-1" });
      await JorongTableTestHelper.addJorong({ id: "jorong-2" });

      // create report for each jorong
      for (let i = 0; i < 30; i++) {
        await UsersTableTestHelper.addUser({
          id: `user-ibu-${i}`,
          role: "mother",
        });
      }

      // create 15 maternal jorong 1
      for (let i = 0; i < 15; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-1",
        });
      }

      // create to 30 maternal
      for (let i = 20; i < 30; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-1",
        });
      }

      // create 5 maternal jorong 2
      for (let i = 15; i < 20; i++) {
        await MaternalTableTestHelper.addMaternal({
          id: `maternal-${i}`,
          userId: `user-ibu-${i}`,
          jorongId: "jorong-2",
        });
      }

      // create 20 maternal history
      for (let i = 0; i < 20; i++) {
        await MaternalHistoryTableTestHelper.addMaternalHistory({
          id: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          maternalStatus: "postpartum",
        });
      }

      // create 10 delivery jorong 1
      for (let i = 0; i < 5; i++) {
        await ChildrenTableTestHelper.addChild({
          id: `child-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          birthDatetime: "2021-08-01",
        });
      }

      // create 2 high risk delivery
      for (let i = 21; i < 23; i++) {
        await MaternalHistoryTableTestHelper.addMaternalHistory({
          id: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          maternalStatus: "postpartum",
          riskStatus: "high_risk",
        });
      }

      // create 10 delivery jorong 1
      for (let i = 21; i < 23; i++) {
        await ChildrenTableTestHelper.addChild({
          id: `child-${i}`,
          maternalHistoryId: `maternal-history-${i}`,
          maternalId: `maternal-${i}`,
          birthDatetime: "2021-08-05",
        });
      }
    });

    it("should return report", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const startDateUtc = new Date("2021-08-01 00:00:00 +07:00").toISOString();
      const endDateUtc = new Date("2021-08-31 23:59:59 +07:00").toISOString();
      const result = await reportRepositoryPostgres.getDeliveryAggregateReport({
        jorongId: "jorong-1",
        startDate: startDateUtc,
        endDate: endDateUtc,
      });

      // Assert
      expect(result).toBeDefined();

      expect(result.dukunDelivery).toBe(0);
      expect(result.highRiskDelivery).toBe(2);
      expect(result.riskDelivery).toBe(0);
      expect(result.delivery).toBe(7);
    });
  });
});
