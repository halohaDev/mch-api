const CalculateAncMonthlyPuskesmasReportUseCase = require("../CalculateAncMonthlyPuskesmasReportUseCase");
const ReportRepository = require("../../../../Domains/report/ReportRepository");

describe("CalculateAncMonthlyPuskesmasReportUseCase", () => {
  it("should orchestrating the calculate anc report action correctly", async () => {
    // Arrange
    const useCasePayload = {
      month: 1,
      year: 2021,
    };

    const mockReportRepository = new ReportRepository();

    mockReportRepository.calculateAnteNatalCarePuskesmasMonthlyReport = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          anemia_less_than_8: 0,
          anemia_between_8_and_11: 0,
          blood_sugar_check: 0,
        })
      );

    const getAncReportUseCase = new CalculateAncMonthlyPuskesmasReportUseCase({
      reportRepository: mockReportRepository,
    });

    // Action
    const reports = await getAncReportUseCase.execute(useCasePayload);

    // Assert
    expect(reports).toStrictEqual({
      anemia_less_than_8: 0,
      anemia_between_8_and_11: 0,
      blood_sugar_check: 0,
    });
    expect(
      mockReportRepository.calculateAnteNatalCarePuskesmasMonthlyReport
    ).toBeCalledWith({
      month: 1,
      year: 2021,
    });
  });
});
