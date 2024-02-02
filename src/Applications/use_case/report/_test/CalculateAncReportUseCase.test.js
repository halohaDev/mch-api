const CalculateAncReportUseCase = require("../CalculateAncReportUseCase");
const ReportRepository = require("../../../../Domains/report/ReportRepository");

describe("CalculateAncReportUseCase", () => {
  it("should orchestrating the calculate anc report action correctly", async () => {
    // Arrange
    const useCasePayload = {
      jorongId: "jorong-123",
      month: 1,
      year: 2021,
    };

    const mockReportRepository = new ReportRepository();

    mockReportRepository.calculateAnteNatalCareReport = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          anemia_less_than_8: 0,
          anemia_between_8_and_11: 0,
          blood_sugar_check: 0,
        })
      );

    const getAncReportUseCase = new CalculateAncReportUseCase({
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
    expect(mockReportRepository.calculateAnteNatalCareReport).toBeCalledWith({
      jorongId: "jorong-123",
      startDate: new Date(2021, 0, 1),
      endDate: new Date(2021, 1, 0),
    });
  });

  it("should orchestrating the calculate anc report action correctly when month and year not provided", async () => {
    // Arrange
    const useCasePayload = {
      jorongId: "jorong-123",
    };

    const mockReportRepository = new ReportRepository();

    mockReportRepository.calculateAnteNatalCareReport = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          anemia_less_than_8: 0,
          anemia_between_8_and_11: 0,
          blood_sugar_check: 0,
        })
      );

    const getAncReportUseCase = new CalculateAncReportUseCase({
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

    const startDate = new Date();
    startDate.setDate(1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    expect(mockReportRepository.calculateAnteNatalCareReport).toBeCalledWith({
      jorongId: "jorong-123",
      startDate,
      endDate,
    });
  });

  it("should orchestrating the calculate anc report action correctly when year not provided", async () => {
    // Arrange
    const useCasePayload = {
      jorongId: "jorong-123",
      month: 1,
    };

    const mockReportRepository = new ReportRepository();

    mockReportRepository.calculateAnteNatalCareReport = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          anemia_less_than_8: 0,
          anemia_between_8_and_11: 0,
          blood_sugar_check: 0,
        })
      );

    const getAncReportUseCase = new CalculateAncReportUseCase({
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

    expect(mockReportRepository.calculateAnteNatalCareReport).toBeCalled();
  });

  it("should orchestrating the calculate anc report action correctly when month not provided", async () => {
    // Arrange
    const useCasePayload = {
      jorongId: "jorong-123",
      year: 2021,
    };

    const mockReportRepository = new ReportRepository();

    mockReportRepository.calculateAnteNatalCareReport = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          anemia_less_than_8: 0,
          anemia_between_8_and_11: 0,
          blood_sugar_check: 0,
        })
      );

    const getAncReportUseCase = new CalculateAncReportUseCase({
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
    expect(mockReportRepository.calculateAnteNatalCareReport).toBeCalledWith({
      jorongId: "jorong-123",
      startDate: new Date(2021, 0, 1),
      endDate: new Date(2021, 12, 0),
    });
  });
});
