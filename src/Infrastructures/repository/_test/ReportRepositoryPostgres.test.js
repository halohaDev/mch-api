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
});
