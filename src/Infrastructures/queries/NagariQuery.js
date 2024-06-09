const BaseQuery = require("./BaseQuery");

class NagariQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "nagari";
  }

  getBySearch(keyword) {
    return [`name LIKE ?`, `%${keyword}%`];
  }
}

module.exports = NagariQuery;