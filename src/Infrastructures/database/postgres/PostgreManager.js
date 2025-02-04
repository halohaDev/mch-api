const DatabaseManager = require("../../../Applications/DatabaseManager");

class PostgreManager extends DatabaseManager {
  constructor(pool) {
    super();
    this._pool = pool;
    this._client = null;
  }

  async transaction(callback) {
    try {
      await this.beginTransaction();
      const returnResult = await callback();
      await this.commitTransaction();
      return returnResult;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      this.releaseClient();
    }
  }

  // create function that enclosed list of function to be on transactional query
  async beginTransaction() {
    this._client = await this._pool.connect();
    await this._client.query("BEGIN");
  }

  async commitTransaction() {
    await this._client.query("COMMIT");
  }

  async rollbackTransaction() {
    await this._client.query("ROLLBACK");
  }

  async releaseClient() {
    this._client.release();
  }
}

module.exports = PostgreManager;
