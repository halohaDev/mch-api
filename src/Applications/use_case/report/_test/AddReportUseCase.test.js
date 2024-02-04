const AddReportUseCase = require("../AddReportUseCase");
const ReportRepositoryPostgres = require("../../../../Infrastructures/repository/ReportRepositoryPostgres");
const UnprocessableError = require("../../../../Commons/exceptions/UnprocessableError");

describe("AddReportUseCase", () => {
  it("should orchestrating the add report action correctly", async () => {
    // Arrange
    const useCasePayload = {
      reportType: "anc_jorong_monthly",
      jorongId: "jorong-123",
      midwifeId: "midwife-123",
      data: {
        hemoglobinCheck: 1,
        anemiaBetween8And11: 2,
        anemiaLessThan8: 3,
        lilaCheck: 4,
        kek: 5,
        proteInUrineCheck: 6,
        proteInUrinePositive: 7,
        bloodSugarCheck: 8,
        bloodSugarMoreThan140: 9,
        comeWithHivPositive: 10,
        hivCheck: 11,
        hivPositive: 12,
        offeredHivTest: 12,
        gotArt: 13,
        vaginalDeliveryHivPositive: 14,
        abdominalDeliveryHivPositive: 15,
        syphilisCheck: 16,
        syphilisPositive: 17,
        hepatitisCheck: 18,
        hepatitisPositive: 19,
      },
      month: 8,
      year: 2021,
    };
    const expectedReport = {
      id: "report-123",
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
      approvedBy: "coordinator-123",
      data: {
        hemoglobinCheck: 1,
        anemiaBetween8And11: 2,
        anemiaLessThan8: 3,
        lilaCheck: 4,
        kek: 5,
        proteInUrineCheck: 6,
        proteInUrinePositive: 7,
        bloodSugarCheck: 8,
        bloodSugarMoreThan140: 9,
        comeWithHivPositive: 10,
        hivCheck: 11,
        hivPositive: 12,
        offeredHivTest: 12,
        gotArt: 13,
        vaginalDeliveryHivPositive: 14,
        abdominalDeliveryHivPositive: 15,
        syphilisCheck: 16,
        syphilisPositive: 17,
        hepatitisCheck: 18,
        hepatitisPositive: 19,
      },
      reportType: "anc_jorong_monthly",
      approvedAt: "2021-08-21",
      status: "approved",
      note: "note",
      month: 8,
      year: 2021,
    };
    const mockReportRepository = new ReportRepositoryPostgres();
    mockReportRepository.addReport = jest.fn(() => expectedReport);
    const addReportUseCase = new AddReportUseCase({
      reportRepository: mockReportRepository,
    });

    // Action
    const report = await addReportUseCase.execute(useCasePayload);

    // Assert
    expect(report).toStrictEqual(expectedReport);
    expect(mockReportRepository.addReport).toBeCalledWith(expect.any(Object));
  });

  it("should throw error when report type not found", async () => {
    // Arrange
    const useCasePayload = {
      reportType: "anc_jorong_monthly",
      jorongId: "jorong-123",
      midwifeId: "midwife-123",
      data: {
        cobaMasukanData: "data",
      },
      month: 8,
      year: 2021,
    };
    const mockReportRepository = new ReportRepositoryPostgres();
    const addReportUseCase = new AddReportUseCase({
      reportRepository: mockReportRepository,
    });

    // Action & Assert
    await expect(addReportUseCase.execute(useCasePayload)).rejects.toThrowError(
      UnprocessableError
    );
  });
});
