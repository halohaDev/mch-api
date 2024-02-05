const UpdateReportStatusUseCase = require("../UpdateReportStatusUseCase");

describe("UpdateReportStatusUseCase", () => {
  it("should orchestrating the update report status action correctly", async () => {
    // Arrange
    const useCasePayload = {
      reportId: "report-123",
      status: "approved",
      note: "note",
    };
    const mockReportRepository = {
      updateStatusReport: jest.fn(),
    };
    const updateReportStatusUseCase = new UpdateReportStatusUseCase({
      reportRepository: mockReportRepository,
    });

    // Action
    await updateReportStatusUseCase.execute(useCasePayload);

    // Assert
    expect(mockReportRepository.updateStatusReport).toBeCalledWith(
      useCasePayload
    );
  });
});
