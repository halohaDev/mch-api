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
    return `LEFT JOIN (
      SELECT maternal_id, MAX(created_at) as latest_created_at FROM maternal_histories GROUP BY maternal_id        
    ) latest_histories ON maternals.id = latest_histories.maternal_id
    LEFT JOIN maternal_histories ON maternal_histories.maternal_id = latest_histories.maternal_id AND maternal_histories.created_at = latest_histories.latest_created_at
    LEFT JOIN (
      SELECT 
        anc.contact_type, 
        MAX(anc.created_at), 
        mh.maternal_id
      FROM ante_natal_cares anc 
      INNER JOIN maternal_histories mh ON anc.maternal_history_id = mh.id 
      GROUP BY anc.contact_type, mh.maternal_id
    ) latest_services ON latest_services.maternal_id = maternals.id`;
  }
}

module.exports = MaternalQuery;
