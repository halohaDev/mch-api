const DomainBase = require("../../DomainBase");

class AddAnteNatalCareReport extends DomainBase {
  constructor(payload) {
    super(payload);
    const {
      placementId,
      approvedBy,
      data,
      reportType,
      approvedAt,
      status,
      note,
      month,
      year,
    } = this.output();

    this.placementId = placementId;
    this.approvedBy = approvedBy;
    this.data = data;
    this.reportType = reportType;
    this.approvedAt = approvedAt;
    this.status = status;
    this.note = note;
    this.month = month;
    this.year = year;
  }

  _verifyPayload() {
    this.isRequired("placementId", "string");
    this.isRequired("data", "object", [
      "hemoglobinCheck",
      "anemiaBetween8And11",
      "anemiaLessThan8",
      "lilaCheck",
      "kek",
      "proteinUrineCheck",
      "proteinUrinePositive",
    ]);
    this.isRequired("reportType", "string");
    this.isOptional("note", "string");
    this.isRequired("month", "number");
    this.isRequired("year", "number");
  }
}

module.exports = AddAnteNatalCareReport;
