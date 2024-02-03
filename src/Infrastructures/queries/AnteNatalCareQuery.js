const BaseQuery = require("./BaseQuery");

class AnteNatalCareQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "ante_natal_cares";
  }

  getByMaternalHistoryId(maternalHistoryId) {
    return ["maternal_history_id = ?", maternalHistoryId];
  }

  getByJorongId(jorongId) {
    return ["jorong_id = ?", jorongId];
  }

  getByDateOfVisitBiggerThan(date) {
    return ["date_of_visit >= ?", date];
  }

  getByDateOfVisitSmallerThan(date) {
    return ["date_of_visit <= ?", date];
  }
}

module.exports = AnteNatalCareQuery;
