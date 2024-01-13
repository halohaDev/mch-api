const BaseQuery = require("./BaseQuery");

class AnteNatalCareQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "ante_natal_cares";
  }

  getByMaternalHistoryId(maternalHistoryId) {
    return ["maternal_history_id = ?", maternalHistoryId];
  }
}

module.exports = AnteNatalCareQuery;
