class MaternalHistoryUseCase {
  constructor({ maternalHistoryRepository, maternalRepository }) {
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._maternalRepository = maternalRepository;
  }

  async showMaternalHistoryByMaternalId(maternalId, currentAuth) {
    const { id: authenticatedId, role: authenticatedRole } = currentAuth;
    const maternal = await this._maternalRepository.findMaternalById(maternalId);

    if (maternal.userId !== authenticatedId && authenticatedRole === "mother") {
      throw new AuthorizationError();
    }

    return await this._maternalHistoryRepository.getMaternalHistoryByMaternalId(maternalId);
  }

  async showMaternalHistoryById(maternalId, maternalHistoryId, currentAuth) {
    const { id: authenticatedId, role: authenticatedRole } = currentAuth;

    const maternal = await this._maternalRepository.findMaternalById(maternalId);

    if (maternal.userId !== authenticatedId && authenticatedRole === "mother") {
      throw new AuthorizationError();
    }

    const maternalHistory = await this._maternalHistoryRepository.getMaternalHistoryById(maternalHistoryId);

    return maternalHistory;
  }
}

module.exports = MaternalHistoryUseCase;
