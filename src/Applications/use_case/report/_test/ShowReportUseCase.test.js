const ShowReportUseCase = require("../ShowReportUseCase");
const ReportRepositoryPostgres = require("../../../../Infrastructures/repository/ReportRepositoryPostgres");

describe("ShowReportUseCase", () => {
  it("should orchestrating the show report action correctly", async () => {
    // Arrange
    const useCasePayload = {
      query: {
        jorongId: "jorong-123",
        midwifeId: "midwife-123",
        reportType: "anc_jorong_monthly",
        status: "approved",
        month: 8,
        year: 2021,
      },
    };
    const expectedReports = [
      {
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
      },
    ];
    const mockReportRepository = new ReportRepositoryPostgres();
    mockReportRepository.showReport = jest.fn(() => expectedReports);
    const showReportUseCase = new ShowReportUseCase({
      reportRepositoryPostgres: mockReportRepository,
    });

    // Action
    const reports = await showReportUseCase.execute(useCasePayload.query);

    // Assert
    expect(reports).toStrictEqual(expectedReports);
    expect(mockReportRepository.showReport).toBeCalledWith(
      useCasePayload.query
    );
  });
});
