const pool = require("../../database/postgres/pool");
const ReportTableTestHelper = require("../../../../tests/ReportTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const ReportType = require("../../../Commons/constants/ReportType");
const ReportQuery = require("../ReportQuery");

describe("Report Query Implementation", () => {
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

    await ReportTableTestHelper.addReport({
      id: "report-123",
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
      approvedBy: "coordinator-123",
      data: {
        cobaMasukanData: "data",
      },
      reportType: ReportType.JORONG_MONTHLY,
      approvedAt: "2021-08-21",
      status: "approved",
      note: "note",
      month: 8,
      year: 2021,
    });

    await ReportTableTestHelper.addReport({
      id: "report-456",
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
      approvedBy: "coordinator-123",
      data: {
        cobaMasukanData: "data",
      },
      reportType: ReportType.JORONG_MONTHLY,
      approvedAt: "2021-08-21",
      status: "approved",
      note: "note",
      month: 9,
      year: 2021,
    });
  });

  describe("when call with wheres", () => {
    it("should return report correctly filter by midwife id", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      // Action
      const reports = await reportQuery.wheres({ requestedBy: "midwife-123" }).paginate();

      // Assert
      expect(reports.data).toHaveLength(2);
    });

    it("should return report correctly filter by jorong id", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      await JorongTableTestHelper.addJorong({ id: "jorong-456" });
      await ReportTableTestHelper.addReport({
        id: "report-789",
        jorongId: "jorong-456",
        month: 10,
      });

      // Action
      const reports = await reportQuery.wheres({ jorongId: "jorong-456" }).paginate();

      // Assert
      expect(reports.data).toHaveLength(1);
    });

    it("should return report correctly filter by report type", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      await ReportTableTestHelper.addReport({
        id: "report-789",
        reportType: ReportType.PWS_ANAK,
        month: 10,
      });

      // Action
      const reports = await reportQuery.wheres({ reportType: ReportType.PWS_ANAK }).paginate();

      // Assert
      expect(reports.data).toHaveLength(1);
    });

    it("should return report correctly filter by status", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      await ReportTableTestHelper.addReport({
        id: "report-789",
        status: "review",
        month: 11,
      });

      // Action
      const reports = await reportQuery.wheres({ status: "review" }).paginate();

      // Assert
      expect(reports.data).toHaveLength(1);
    });

    it("should return report correctly filter by month", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      await ReportTableTestHelper.addReport({
        id: "report-789",
        month: 12,
      });

      // Action
      const reports = await reportQuery.wheres({ month: 12 }).paginate();

      // Assert
      expect(reports.data).toHaveLength(1);
    });

    it("should return report correctly filter by year", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      await ReportTableTestHelper.addReport({
        id: "report-789",
        year: 2022,
      });

      // Action
      const reports = await reportQuery.wheres({ year: 2022 }).paginate();

      // Assert
      expect(reports.data).toHaveLength(1);
    });

    it("should return report sorted by created_at", async () => {
      // Arrange
      const reportQuery = new ReportQuery({ pool });

      await ReportTableTestHelper.addReport({
        id: "report-789",
        createdAt: "2023-10-22",
        month: 10,
      });

      await ReportTableTestHelper.addReport({
        id: "report-101",
        createdAt: "2024-07-23",
        month: 7,
      });

      const params = {
        orderBy: "createdAt:desc",
      };

      // Action
      const reports = await reportQuery.orders(params).paginate();

      // Assert
      expect(reports.data[0].id).toEqual("report-101");
    });
  });
});
