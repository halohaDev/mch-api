const DomainBase = require("../../DomainBase");
const ReportStatus = require("../../../Commons/constants/ReportStatus");

class UpdateStatusReport extends DomainBase {
  constructor(payload) {
    super(payload);

    const { status, note } = this.output();

    this.status = status;
    this.note = note;
  }

  _verifyPayload() {
    this.isRequired("status", "containOf", Object.values(ReportStatus));
    this.isOptional("note", "string");
  }
}

module.exports = UpdateStatusReport;
