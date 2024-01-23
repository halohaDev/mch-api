const ReportRepositoryPostgres = require("../ReportRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const ReportTableTestHelper = require("../../../../tests/ReportTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCareTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const {
  randomNumber,
  randomFromArray,
  randomDate,
} = require("../../../Commons/helper");

describe("ReportRepository postgres implementation", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ReportTableTestHelper.cleanTable();
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
      const reportRepositoryPostgres = new ReportRepositoryPostgres(
        pool,
        mockIdGenerator
      );

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
      await expect(
        reportRepositoryPostgres.findReportById("report-123")
      ).rejects.toThrowError(NotFoundError);
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
      const report = await reportRepositoryPostgres.findReportById(
        "report-123"
      );

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

  describe("calculateAncReport function", () => {
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

      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {});

      // Action
      const result =
        await reportRepositoryPostgres.calculateAnteNatalCareReport({
          jorongId: "jorong-123",
          startDate: "2021-08-01",
          endDate: "2021-08-31",
        });

      const firstResult = result[0];

      // Assert
      expect(firstResult.hemoglobin_check).toEqual(randomHb.length);
      expect(firstResult.anemia_less_than_8).toEqual(
        randomHb.filter((hb) => hb < 8).length
      );
      expect(firstResult.anemia_between_8_and_11).toEqual(
        randomHb.filter((hb) => hb >= 8 && hb <= 11.9).length
      );
      expect(firstResult.lila_check).toEqual(
        randomUpperArmCircumferences.length
      );
      expect(firstResult.kek).toEqual(
        randomUpperArmCircumferences.filter((uac) => uac < 23).length
      );
      expect(firstResult.protein_in_urine_check).toEqual(0);
      expect(firstResult.protein_in_urine_positive).toEqual(0);
      expect(firstResult.blood_sugar_check).toEqual(randomBloodSugar.length);
      expect(firstResult.blood_sugar_more_than_140).toEqual(
        randomBloodSugar.filter((bs) => bs > 140).length
      );
      expect(firstResult.come_with_hiv_positive).toEqual(
        randomHiv.filter((hiv) => hiv === "positive_non_test").length
      );
      expect(firstResult.hiv_check).toEqual(
        randomHiv.filter((hiv) => hiv === "positive" || hiv === "negative")
          .length
      );
      expect(firstResult.hiv_positive).toEqual(
        randomHiv.filter((hiv) => hiv === "positive").length
      );
      expect(firstResult.offered_hiv_test).toEqual(
        randomHiv.filter(
          (hiv) =>
            hiv === "rejected" || hiv === "positive" || hiv === "negative"
        ).length
      );
      expect(firstResult.hepatitis_check).toEqual(0);
      expect(firstResult.hepatitis_positive).toEqual(0);
      expect(firstResult.syphilis_check).toEqual(randomSyphilis.length);
      expect(firstResult.syphilis_positive).toEqual(
        randomSyphilis.filter((syphilis) => syphilis === "positive").length
      );
      expect(firstResult.got_art).toEqual(0);
    });
  });
});
