const MaternalServiceRepository = require("../../Domains/maternal/MaternalServiceRepository");

class MaternalServiceRepositoryPostgres extends MaternalServiceRepository {
  constructor(pool, snakeToCamelObject) {
    super();
    this._pool = pool;
    this._snakeToCamelObject = snakeToCamelObject;
  }

  async getLatestServiceByMaternalHistoryId(maternalHistoryId) {
    const query = {
      text: `SELECT id, service_type, sub_service_type, service_date FROM (
        SELECT id, contact_type as sub_service_type, date_of_visit as service_date, 'anc' as service_type 
        FROM ante_natal_cares 
        WHERE maternal_history_id = $1
        ORDER BY date_of_visit DESC
      ) services LIMIT 1`,
      values: [maternalHistoryId],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelObject(result.rows[0]);
  }

  async getService() {
    // TODO: implement this method
  }
}

module.exports = MaternalServiceRepositoryPostgres;