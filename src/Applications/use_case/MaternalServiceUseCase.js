const AddAnteNatalCare = require('../../Domains/ante_natal/entities/AddAnteNatalCare');
const NewMaternalHistory = require('../../Domains/maternal/entities/NewMaternalHistory');

class MaternalServiceUseCase {
  constructor({ anteNatalCareRepository, maternalHistoryRepository, maternalRepository, databaseManager }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._maternalRepository = maternalRepository;
    this._databaseManager = databaseManager;
  }

  async addAnteNatalCareService(useCasePayload) {
    const maternalHistoryId = useCasePayload.maternalHistoryId;

    this._databaseManager.beginTransaction();

    if (maternalHistoryId === undefined || maternalHistoryId === '') {
      const newMaternalHistory = new NewMaternalHistory(useCasePayload);
      const { id: maternalHistoryId } = await this._maternalHistoryRepository.addMaternalHistory(newMaternalHistory);
    } else {
      if (useCasePayload.contactType === 'k1') {
        await this._maternalHistoryRepository.updateMaternalHistoryById(maternalHistoryId, { ...useCasePayload });
      }
    }

    const addAnteNatalCare = new AddAnteNatalCare({
      ...useCasePayload,
      maternalHistoryId,
    });

    const addedAnteNatalCare = await this._anteNatalCareRepository.addAnteNatalCare(addAnteNatalCare);

    this._databaseManager.commitTransaction();

    return addedAnteNatalCare;
  }
}

module.exports = MaternalServiceUseCase;