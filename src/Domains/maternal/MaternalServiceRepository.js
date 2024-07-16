class MaternalServiceRepository {
  async getLatestServiceByMaternalHistoryId(maternalHistoryId) {
    throw new Error("MATERNAL_SERVICE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getServices() {
    throw new Error("MATERNAL_SERVICE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = MaternalServiceRepository;