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
      SELECT maternal_status, maternal_id FROM maternal_histories GROUP BY        
    ) maternal_histories ON maternal_histories.maternal_id = maternals.id`;
  }
}

module.exports = MaternalQuery;
