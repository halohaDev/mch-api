const BaseQuery = require("./BaseQuery");

class ReportQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "agg_report_data";
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
    return ["report_type = ?", type];
  }
}

module.exports = ReportQuery;
