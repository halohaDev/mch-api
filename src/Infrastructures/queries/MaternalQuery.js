const BaseQuery = require("./BaseQuery");

class MaternalQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getBySearch(keyword) {
    const queryKeyword = `${keyword}%`;
    return ["users.name ILIKE ? OR users.nik ILIKE ?", queryKeyword, queryKeyword];
  }

  joinByUsers() {
    return `INNER JOIN users ON users.id = maternals.user_id`;
  }

  joinByJorong() {
    return `LEFT JOIN jorong ON maternals.jorong_id = jorong.id`;
  }
}

module.exports = MaternalQuery;
