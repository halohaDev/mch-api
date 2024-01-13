class ShowAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
  }

  async execute(useCasePayload) {
    return this._anteNatalCareRepository.showAnteNatalCare(useCasePayload);
  }
}

module.exports = ShowAnteNatalCareUseCase;
