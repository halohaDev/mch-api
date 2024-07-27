class MaternalHistoryRepository {
  async addMaternalHistory(maternalHistory) {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getMaternalHistoryByMaternalId(patientId) {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async updateMaternalHistoryById(id, data) {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getMaternalHistories() {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getMaternalHistoryById(id) {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getLatestMaternalHistoryByMaternalId(id) {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async updateRiskStatus(id, riskStatus) {
    throw new Error("MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = MaternalHistoryRepository;
