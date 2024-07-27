const DomainBase = require("../../DomainBase");
const ReportStatus = require("../../../Commons/constants/ReportStatus");

class UpdateStatusReport extends DomainBase {
  constructor(payload) {
    super(payload);

    const { status, note, approvedBy, approvedAt } = this.output();

    this.status = status;
    this.note = note;
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
  }

  _verifyPayload() {
    this.isRequired("status", "containOf", Object.values(ReportStatus));
    this.isOptional("note", "string");
    this.isOptional("approvedBy", "string");
    this.isOptional("approvedAt", "string");
  }
}

module.exports = UpdateStatusReport;
