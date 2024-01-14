class ShowAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
  }

  async execute(useCasePayload) {
    return this._anteNatalCareRepository.showAnteNatalCares(useCasePayload);
  }
}

module.exports = ShowAnteNatalCareUseCase;
