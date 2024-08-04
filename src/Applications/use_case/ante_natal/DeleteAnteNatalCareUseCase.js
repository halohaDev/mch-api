class DeleteAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
  }

  async execute(anteNatalCareId) {
    await this._anteNatalCareRepository.findById(anteNatalCareId);

    return this._anteNatalCareRepository.delete(anteNatalCareId);
  }
}
