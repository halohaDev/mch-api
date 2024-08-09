class UpdateAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository, maternalHistoryRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
  }

  async execute(id, anteNatalData) {
    await this._anteNatalCareRepository.findAnteNatalCareById(anteNatalData.id);
    await this._maternalHistoryRepository.findMaternalHistoryById(anteNatalData.maternalHistoryId);

    return this._anteNatalCareRepository.updateAnteNatalCare(id, anteNatalData);
  }
}

module.exports = UpdateAnteNatalCareUseCase;
