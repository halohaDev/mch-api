const DomainBase = require("../../DomainBase");
const ReportType = require("../../../Commons/constants/ReportType");

class AddAnteNatalCareReport extends DomainBase {
  constructor(payload) {
    super(payload);

    const { midwifeId, jorongId, data, reportType, month, year } =
      this.output();

    this.midwifeId = midwifeId;
    this.jorongId = jorongId;
    this.approvedBy = null;
    this.data = data;
    this.reportType = reportType;
    this.approvedAt = null;
    this.status = "draft";
    this.note = null;
    this.month = month;
    this.year = year;
  }

  _verifyPayload() {
    this.isRequired("midwifeId", "string");
    this.isOptional("jorongId", "string");
    this.isRequired("data", "object", [
      "hemoglobinCheck",
      "anemiaBetween8And11",
      "anemiaLessThan8",
      "lilaCheck",
      "kek",
      "proteInUrineCheck",
      "proteInUrinePositive",
      "bloodSugarCheck",
      "bloodSugarMoreThan140",
      "comeWithHivPositive",
      "hivCheck",
      "offeredHivTest",
      "hivPositive",
      "gotArt",
      "vaginalDeliveryHivPositive",
      "abdominalDeliveryHivPositive",
      "syphilisCheck",
      "syphilisPositive",
      "hepatitisCheck",
      "hepatitisPositive",
    ]);
    this.isRequired("reportType", "containOf", Object.values(ReportType));
    this.isOptional("note", "string");
    this.isRequired("month", "number");
    this.isRequired("year", "number");
  }
}

module.exports = AddAnteNatalCareReport;
