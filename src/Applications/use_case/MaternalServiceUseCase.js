const AddAnteNatalCare = require('../../Domains/ante_natal/entities/AddAnteNatalCare');
const NewMaternalHistory = require('../../Domains/maternal/entities/NewMaternalHistory');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class MaternalServiceUseCase {
  constructor({ anteNatalCareRepository, maternalHistoryRepository, maternalRepository, databaseManager, maternalServiceRepository, snakeToCamelObject }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._maternalServiceRepository = maternalServiceRepository;
    this._maternalRepository = maternalRepository;
    this._databaseManager = databaseManager;
  }

  async getLastServiceByMaternalId(maternalId, currentAuth) {
    const { id: authenticatedId, role: authenticatedRole } = currentAuth;
    const maternal = await this._maternalRepository.findMaternalById(maternalId);

    if (maternal.userId !== authenticatedId && authenticatedRole === 'mother') {
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

    if (maternal.userId !== authenticatedId && authenticatedRole === 'mother') {
      throw new AuthorizationError();
    }

    const lastService = await this._maternalServiceRepository.getLatestServiceByMaternalHistoryId(maternalHistoryId);

    return lastService;
  }
}

module.exports = MaternalServiceUseCase;