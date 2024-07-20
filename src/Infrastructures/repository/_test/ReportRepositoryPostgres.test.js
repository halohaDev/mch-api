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
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, mockIdGenerator, snakeToCamelObject);

      // Action
      await reportRepositoryPostgres.addReport({
        requestedBy: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "jorong_monthly",
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
      expect(report.requestedBy).toBe("midwife-123");
      expect(report.jorongId).toBe("jorong-123");
      expect(report.approvedBy).toBe("coordinator-123");
      expect(report.aggregatedData).toEqual({ cobaMasukanData: "data" });
      expect(report.reportType).toBe("jorong_monthly");
      expect(report.approvedAt).toBeDefined();
      expect(report.status).toBe("approved");
      expect(report.note).toBe("note");
      expect(report.month).toBe(8);
      expect(report.year).toBe(2021);
      expect(report.createdAt).toBeDefined();
      expect(report.updatedAt).toBeDefined();
    });
  });

  describe("findReportById function", () => {
    it("should throw NotFoundError when report not found", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action & Assert
      await expect(reportRepositoryPostgres.findReportById("report-123")).rejects.toThrowError(NotFoundError);
    });

    it("should return report when report is found", async () => {
      // Arrange
      await ReportTableTestHelper.addReport({
        id: "report-123",
        requesterId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "jorong_monthly",
        approvedAt: "2021-08-21",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
      });
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const report = await reportRepositoryPostgres.findReportById("report-123");

      // Assert
      expect(report).toStrictEqual({
        id: "report-123",
        requestedBy: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        aggregatedData: {
          cobaMasukanData: "data",
        },
        reportType: "jorong_monthly",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        approvedAt: expect.any(Date),
      });
    });
  });

  describe("updateReport function", () => {
    it("should update report", async () => {
      // Arrange
      await ReportTableTestHelper.addReport({
        id: "report-123",
        requesterId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "jorong_monthly",
        approvedAt: "2021-08-21",
        status: "approved",
        note: "note",
        month: 8,
        year: 2021,
      });
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

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
        requesterId: "midwife-123",
        jorongId: "jorong-123",
        approvedBy: "coordinator-123",
        data: {
          cobaMasukanData: "data",
        },
        reportType: "jorong_monthly",
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

      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

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
      expect(result).toBeDefined();
      expect(result.totalAnc).toBe(20);
      expect(result.c1).toBe(15);
      expect(result.c2).toBe(0);
      expect(result.c3).toBe(0);
      expect(result.c4).toBe(0);
      expect(result.c5).toBe(0);
      expect(result.c6).toBe(5);
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
      expect(result).toBeDefined();
      expect(result.totalAnc).toBe(5);
      expect(result.c1).toBe(0);
      expect(result.c2).toBe(0);
      expect(result.c3).toBe(0);
      expect(result.c4).toBe(0);
      expect(result.c5).toBe(0);
      expect(result.c6).toBe(5);
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
      expect(result).toBeDefined();
      expect(result.totalPnc).toBe(20);
      expect(result.pnc1).toBe(15);
      expect(result.pnc2).toBe(0);
      expect(result.pnc3).toBe(0);
      expect(result.pnc4).toBe(5);
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
      expect(result).toBeDefined();
      expect(result.ancComplication).toBe(15);
      expect(result.pncComplication).toBe(0);
      expect(result.ancDeath).toBe(1);
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

  describe("getOnProcessRecapJorong", () => {
    beforeEach(async () => {
      // create 2 jorong
      await JorongTableTestHelper.addJorong({ id: "jorong-1" });
      await JorongTableTestHelper.addJorong({ id: "jorong-2" });

      // create reports for jorong 1
      await ReportTableTestHelper.addReport({ id: "report-1", jorongId: "jorong-1", status: "review" });
      // create reprots for jorong 2
      await ReportTableTestHelper.addReport({ id: "report-2", jorongId: "jorong-2", status: "draft" });
    });

    it("should return report", async () => {
      // Arrange
      const reportRepositoryPostgres = new ReportRepositoryPostgres(pool, {}, snakeToCamelObject);

      // Action
      const result = await reportRepositoryPostgres.getOnProcessRecapJorong(8, 2021);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].jorongId).toBe("jorong-1");
    });
  });
});
