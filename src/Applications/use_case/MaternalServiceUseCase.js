const AddAnteNatalCare = require("../../Domains/ante_natal/entities/AddAnteNatalCare");
const NewMaternalHistory = require("../../Domains/maternal/entities/NewMaternalHistory");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class MaternalServiceUseCase {
  constructor({
    anteNatalCareRepository,
    maternalHistoryRepository,
    maternalRepository,
    databaseManager,
    maternalServiceRepository,
    snakeToCamelObject,
    childRepository,
  }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._maternalServiceRepository = maternalServiceRepository;
    this._maternalRepository = maternalRepository;
    this._databaseManager = databaseManager;
    this._childRepository = childRepository;
  }

  async getLastServiceByMaternalId(maternalId, currentAuth) {
    const { id: authenticatedId, role: authenticatedRole } = currentAuth;
    const maternal = await this._maternalRepository.findMaternalById(maternalId);

    if (maternal.userId !== authenticatedId && authenticatedRole === "mother") {
      throw new AuthorizationError();
    }

    const maternalHistory = await this._maternalHistoryRepository.getLatestMaternalHistoryByMaternalId(maternalId);
    const lastService = await this._maternalServiceRepository.getLatestServiceByMaternalHistoryId(maternalHistory.id);

    return lastService;
  }

  async getLastServiceByMaternalHistoryId(maternalHistoryId, currentAuth) {
    const { id: authenticatedId, role: authenticatedRole } = currentAuth;
    const maternalHistory = await this._maternalHistoryRepository.getMaternalHistoryById(maternalHistoryId);
    const maternal = await this._maternalRepository.findMaternalById(maternalHistory.maternalId);

    if (maternal.userId !== authenticatedId && authenticatedRole === "mother") {
      throw new AuthorizationError();
    }

    const lastService = await this._maternalServiceRepository.getLatestServiceByMaternalHistoryId(maternalHistoryId);

    return lastService;
  }

  async deliverChild(useCasePayload) {
    const { maternalHistoryId, maternalId } = useCasePayload;

    if (!!maternalHistoryId) await this._maternalHistoryRepository.getMaternalHistoryById(maternalHistoryId);
    if (!!maternalId) await this._maternalRepository.findMaternalById(maternalId);

    try {
      await this._databaseManager.beginTransaction();

      if (!!maternalHistoryId) {
        await this._maternalHistoryRepository.updateMaternalHistoryById(maternalHistoryId, { maternalStatus: "postpartum" });
      }

      const result = await this._childRepository.addChild(useCasePayload);
      await this._databaseManager.commitTransaction();

      return result;
    } catch (error) {
      await this._databaseManager.rollbackTransaction();
      throw error;
    } finally {
      await this._databaseManager.releaseClient();
    }
  }
}

module.exports = MaternalServiceUseCase;
