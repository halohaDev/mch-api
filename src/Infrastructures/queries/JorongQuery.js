const BaseQuery = require("./BaseQuery");

class NagariQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "jorong";
  }

  getByNagariId(nagariId) {
    return [`nagari_id = ?`, nagariId];
  }
}

module.exports = NagariQuery;