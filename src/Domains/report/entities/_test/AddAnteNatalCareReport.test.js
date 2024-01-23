const AnteNatalCareReport = require("../AddAnteNatalCareReport");
const UnprocessableEntityError = require("../../../../Commons/exceptions/UnprocessableError");

describe("a AnteNatalCareReport entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
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
        offeredHivTest: 12,
        gotArt: 13,
        vaginalDeliveryHivPositive: 14,
        abdominalDeliveryHivPositive: 15,
        syphilisCheck: 16,
        syphilisPositive: 17,
        hepatitisCheck: 18,
        hepatitisPositive: 19,
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
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
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
        offeredHivTest: 12,
        gotArt: 13,
        vaginalDeliveryHivPositive: 14,
        abdominalDeliveryHivPositive: 15,
        syphilisCheck: 16,
        syphilisPositive: 17,
        hepatitisCheck: 18,
        hepatitisPositive: 19,
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
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
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
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
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
      note: "note",
      month: 8,
      year: 2021,
      reportType: "anc_jorong_monthly",
    };

    // Action
    const AnteNatalCareReportInstance = new AnteNatalCareReport(payload);

    // Assert
    expect(AnteNatalCareReportInstance.midwifeId).toEqual(payload.midwifeId);
    expect(AnteNatalCareReportInstance.jorongId).toEqual(payload.jorongId);
    expect(AnteNatalCareReportInstance.data).toEqual(payload.data);
    expect(AnteNatalCareReportInstance.data.anemiaBetween8And11).toEqual(
      payload.data.anemiaBetween8And11
    );
    expect(AnteNatalCareReportInstance.data.anemiaLessThan8).toEqual(
      payload.data.anemiaLessThan8
    );
    expect(AnteNatalCareReportInstance.data.bloodSugarCheck).toEqual(
      payload.data.bloodSugarCheck
    );
    expect(AnteNatalCareReportInstance.data.bloodSugarMoreThan140).toEqual(
      payload.data.bloodSugarMoreThan140
    );
    expect(AnteNatalCareReportInstance.data.comeWithHivPositive).toEqual(
      payload.data.comeWithHivPositive
    );
    expect(AnteNatalCareReportInstance.data.gotArt).toEqual(
      payload.data.gotArt
    );
    expect(AnteNatalCareReportInstance.data.hepatitisCheck).toEqual(
      payload.data.hepatitisCheck
    );
    expect(AnteNatalCareReportInstance.data.hepatitisPositive).toEqual(
      payload.data.hepatitisPositive
    );
    expect(AnteNatalCareReportInstance.data.hemoglobinCheck).toEqual(
      payload.data.hemoglobinCheck
    );
    expect(AnteNatalCareReportInstance.data.hivCheck).toEqual(
      payload.data.hivCheck
    );
    expect(AnteNatalCareReportInstance.data.kek).toEqual(payload.data.kek);
    expect(AnteNatalCareReportInstance.data.lilaCheck).toEqual(
      payload.data.lilaCheck
    );
    expect(AnteNatalCareReportInstance.data.offeredHivTest).toEqual(
      payload.data.offeredHivTest
    );
    expect(AnteNatalCareReportInstance.data.proteinUrineCheck).toEqual(
      payload.data.proteinUrineCheck
    );
    expect(AnteNatalCareReportInstance.data.proteinUrinePositive).toEqual(
      payload.data.proteinUrinePositive
    );
    expect(AnteNatalCareReportInstance.data.syphilisCheck).toEqual(
      payload.data.syphilisCheck
    );
    expect(AnteNatalCareReportInstance.data.syphilisPositive).toEqual(
      payload.data.syphilisPositive
    );
    expect(AnteNatalCareReportInstance.data.vaginalDeliveryHivPositive).toEqual(
      payload.data.vaginalDeliveryHivPositive
    );
    expect(
      AnteNatalCareReportInstance.data.abdominalDeliveryHivPositive
    ).toEqual(payload.data.abdominalDeliveryHivPositive);
    expect(AnteNatalCareReportInstance.reportType).toEqual(payload.reportType);
    expect(AnteNatalCareReportInstance.note).toEqual(payload.note);
    expect(AnteNatalCareReportInstance.month).toEqual(payload.month);
    expect(AnteNatalCareReportInstance.year).toEqual(payload.year);
  });
});
