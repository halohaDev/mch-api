class DatabaseManager {
  async beginTransaction() {
    throw new Error('DATABASEMANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async commitTransaction() {
    throw new Error('DATABASEMANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = DatabaseManager;