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

  async getServices() {
    // TODO: implement this method
  }

  async getServiceByMaternalHistoryId(maternalHistoryId) {
    // union table ante_natal_cares, post_natal_cares
    const query = {
      text: `SELECT id, service_type, sub_service_type, service_date FROM (
        SELECT id, (contact_type)::varchar as sub_service_type, date_of_visit as service_date, 'anc' as service_type, jorong_id, midwife_id
        FROM ante_natal_cares 
        WHERE maternal_history_id = $1
        UNION
        SELECT id, (post_natal_type)::varchar as sub_service_type, date_of_visit as service_date, 'pnc' as service_type, jorong_id, midwife_id
        FROM post_natal_cares
        WHERE maternal_history_id = $1
        UNION
        SELECT id, (complication_type)::varchar as sub_service_type, complication_date as service_date, 'maternal_complication' as service_type, '', ''
        FROM maternal_complications
        WHERE maternal_history_id = $1
      ) services ORDER BY service_date DESC`,
      values: [maternalHistoryId],
    };

    const result = await this._pool.query(query);
    return this._snakeToCamelObject(result.rows);
  }
}

module.exports = MaternalServiceRepositoryPostgres;
