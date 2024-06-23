const DatabaseManager = require("../../../Applications/DatabaseManager");

class PostgreManager extends DatabaseManager {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async beginTransaction() {
    const client = await this._pool.connect();
    await client.query("BEGIN");
    return client;
  }

  async commitTransaction(client) {
    await client.query("COMMIT");
    client.release();
  }
}

module.exports = PostgreManager;