const UpdateReportStatusUseCase = require("../UpdateReportStatusUseCase");
const UpdateStatusReport = require("../../../../Domains/report/entities/UpdateStatusReport");

describe("UpdateReportStatusUseCase", () => {
  it("should orchestrating the update report status action correctly", async () => {
    // Arrange
    const reportId = "report-123";
    const useCasePayload = {
      status: "approved",
      note: "note",
    };

    const updateStatusReport = new UpdateStatusReport(useCasePayload);
    const expectedPayload = {
      id: reportId,
      ...updateStatusReport,
    };

    const mockReportRepository = {
      updateReportStatusAndNote: jest.fn(),
    };

    const updateReportStatusUseCase = new UpdateReportStatusUseCase({
      reportRepository: mockReportRepository,
    });

    // Action
    await updateReportStatusUseCase.execute(reportId, useCasePayload);

    // Assert
    expect(mockReportRepository.updateReportStatusAndNote).toBeCalledWith(
      expectedPayload
    );
  });
});
