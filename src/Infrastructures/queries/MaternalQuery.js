const BaseQuery = require("./BaseQuery");

class MaternalQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getByNik(nik) {
    return ["users.nik = ?", nik];
  }

  getBySearch(keyword) {
    const queryKeyword = `${keyword}%`;
    return ["users.name ILIKE ? OR users.nik ILIKE ?", queryKeyword, queryKeyword];
  }

   joinByLastMaternalStatus() {
    return `LEFT JOIN (
        SELECT maternal_id, MAX(created_at) as latest_created_at FROM maternal_histories GROUP BY maternal_id        
      ) latest_histories ON maternals.id = latest_histories.maternal_id
      LEFT JOIN maternal_histories ON maternal_histories.maternal_id = latest_histories.maternal_id AND maternal_histories.created_at = latest_histories.latest_created_at`;
   }

  joinByUsers() {
    return `INNER JOIN users ON users.id = maternals.user_id`;
  }

  joinByJorong() {
    return `LEFT JOIN jorong ON maternals.jorong_id = jorong.id`;
  }
}

module.exports = MaternalQuery;
