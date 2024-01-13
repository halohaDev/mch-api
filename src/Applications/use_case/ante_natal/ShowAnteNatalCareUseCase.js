class ShowAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
  }

  async execute(useCasePayload) {
    return this._anteNatalCareRepository.getAnteNatalCares(useCasePayload);
  }
}

module.exports = ShowAnteNatalCareUseCase;
