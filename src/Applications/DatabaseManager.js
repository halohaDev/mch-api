class DatabaseManager {
  async beginTransaction() {
    throw new Error("DATABASEMANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async commitTransaction() {
    throw new Error("DATABASEMANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async rollbackTransaction() {
    throw new Error("DATABASEMANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async releaseClient() {
    throw new Error("DATABASEMANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async transaction(callback) {
    throw new Error("DATABASEMANAGER.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = DatabaseManager;
