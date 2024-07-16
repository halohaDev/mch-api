const MaternalComplicationRepository = require("../../Domains/complication/MaternalComplicationRepository");

class MaternalComplicationRepositoryPostgres extends MaternalComplicationRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addMaternalComplication(payload) {
    const { maternalHistoryId, isHandled, isReferred, complicationType, description, comeCondition, backCondition, complicationDate } =
      payload;
    const id = `mc-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO maternal_complications(id, maternal_history_id, is_handled, is_referred, complication_type, description, come_condition, back_condition, complication_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [id, maternalHistoryId, isHandled, isReferred, complicationType, description, comeCondition, backCondition, complicationDate],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = MaternalComplicationRepositoryPostgres;
