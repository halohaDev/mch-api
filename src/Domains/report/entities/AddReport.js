const DomainBase = require("../../DomainBase");
const ReportType = require("../../../Commons/constants/ReportType");

class NewReport extends DomainBase {
  constructor(payload) {
    super(payload);

    const { requestedBy, jorongId, aggregatedData, reportType, month, year } = this.output();

    this.requestedBy = requestedBy;
    this.jorongId = jorongId;
    this.approvedBy = null;
    this.aggregatedData = aggregatedData;
    this.reportType = reportType;
    this.approvedAt = null;
    this.status = "draft";
    this.note = null;
    this.month = month;
    this.year = year;
  }

  _verifyPayload() {
    this.isRequired("requestedBy", "string");
    this.isOptional("jorongId", "string");
    this.isRequired("aggregatedData", "object");
    this.isRequired("reportType", "containOf", Object.values(ReportType));
    this.isOptional("note", "string");
    this.isRequired("month", "number");
    this.isRequired("year", "number");
  }
}

module.exports = NewReport;
