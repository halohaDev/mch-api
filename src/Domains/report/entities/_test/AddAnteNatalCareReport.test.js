const AnteNatalCareReport = require("../AddAnteNatalCareReport");
const UnprocessableEntityError = require("../../../../Commons/exceptions/UnprocessableError");

describe("a AnteNatalCareReport entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      placementId: "placement-123",
      data: {
        hemoglobinCheck: 1,
        anemiaBetween8And11: 2,
        anemiaLessThan8: 3,
        lilaCheck: 4,
        kek: 5,
        proteinUrineCheck: 6,
        proteinUrinePositive: 7,
      },
      note: "note",
      year: 2021,
      reportType: "anc_jorong_monthly",
    };

    // Action and Assert
    expect(() => new AnteNatalCareReport(payload)).toThrowError(
      UnprocessableEntityError
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      placementId: "placement-123",
      data: {
        hemoglobinCheck: 1,
        anemiaBetween8And11: 2,
        anemiaLessThan8: 3,
        lilaCheck: 4,
        kek: 5,
        proteinUrineCheck: 6,
        proteinUrinePositive: 7,
      },
      note: "note",
      month: 8,
      year: 2021,
      reportType: 123,
    };

    // Action and Assert
    expect(() => new AnteNatalCareReport(payload)).toThrowError(
      UnprocessableEntityError
    );
  });

  it("should throw error when payload did not contain proper data", () => {
    // Arrange
    const payload = {
      placementId: "placement-123",
      data: {
        hemoglobinCheck: 1,
        anemiaBetween8And11: 2,
        anemiaLessThan8: 3,
        lilaCheck: 4,
        kek: 5,
        proteinUrineCheck: 6,
      },
      note: "note",
      month: 8,
      year: 2021,
      reportType: "anc_jorong_monthly",
    };

    // Action and Assert
    expect(() => new AnteNatalCareReport(payload)).toThrowError(
      UnprocessableEntityError
    );
  });

  it("should create AnteNatalCareReport object correctly", () => {
    // Arrange
    const payload = {
      placementId: "placement-123",
      data: {
        hemoglobinCheck: 1,
        anemiaBetween8And11: 2,
        anemiaLessThan8: 3,
        lilaCheck: 4,
        kek: 5,
        proteinUrineCheck: 6,
        proteinUrinePositive: 7,
      },
      note: "note",
      month: 8,
      year: 2021,
      reportType: "anc_jorong_monthly",
    };

    // Action
    const AnteNatalCareReportInstance = new AnteNatalCareReport(payload);

    // Assert
    expect(AnteNatalCareReportInstance.placementId).toEqual(
      payload.placementId
    );
    expect(AnteNatalCareReportInstance.data).toEqual(payload.data);
    expect(AnteNatalCareReportInstance.reportType).toEqual(payload.reportType);
    expect(AnteNatalCareReportInstance.note).toEqual(payload.note);
    expect(AnteNatalCareReportInstance.month).toEqual(payload.month);
    expect(AnteNatalCareReportInstance.year).toEqual(payload.year);
  });
});
