const BaseQuery = require("./BaseQuery");

class ReportQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getByJorongId(jorongId) {
    return ["jorong_id = ?", jorongId];
  }

  getByMidwifeId(midwifeId) {
    return ["midwife_id = ?", midwifeId];
  }

  getByMonth(month) {
    return ["month = ?", month];
  }

  getByYear(year) {
    return ["year = ?", year];
  }

  getByStatus(status) {
    return ["status = ?", status];
  }

  getByReportType(type) {
    if (type === "pws") {
      return ["report_type = ? OR report_type = ?", "pws_ibu", "pws_anak"];
    }

    return ["report_type = ?", type];
  }

  orderByCreatedAt(direction) {
    return ["created_at", direction];
  }
}

module.exports = ReportQuery;
