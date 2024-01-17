const ReportRepositoryPostgres = require("../ReportRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const ReportTableTestHelper = require("../../../../tests/ReportTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");

describe("ReportRepository postgres implementation", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ReportTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "midwife-123", role: "midwife" });
    await UsersTableTestHelper.addUser({
      id: "coordinator-123",
      role: "coordinator",
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
});
