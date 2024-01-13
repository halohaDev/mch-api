const BaseQuery = require("./BaseQuery");

class MaternalQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getBySearch(keyword) {
    const queryKeyword = `${keyword}%`;
    return ["users.name LIKE ?", queryKeyword];
  }

  joinByUsers() {
    return `INNER JOIN users ON users.id = maternals.user_id`;
  }

  joinByLastMaternalStatus() {
    return `INNER JOIN (
      SELECT inner_mh.maternal_id, inner_mh.maternal_status FROM maternal_histories inner_mh ORDER BY inner_mh.maternal_status DESC LIMIT 1
    ) maternal_histories ON maternal_histories.maternal_id = maternals.id`;
  }
}

module.exports = MaternalQuery;
