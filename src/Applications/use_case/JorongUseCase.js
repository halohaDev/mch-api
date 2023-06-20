const CreateJorong = require('../../Domains/jorong/entities/CreateJorong');

class JorongUseCase {
  constructor({ jorongRepository, nagariRepository }) {
    this._jorongRepository = jorongRepository;
    this._nagariRepository = nagariRepository;
  }

  async addJorong(useCasePayload) {
    const createJorong = new CreateJorong(useCasePayload);

    await this._nagariRepository.getNagariById(createJorong.nagariId);
    await this._jorongRepository.verifyAvailableJorongName(createJorong.name);

    return this._jorongRepository.addJorong(createJorong);
  }
}

module.exports = JorongUseCase;
