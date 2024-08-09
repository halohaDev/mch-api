const CreateJorong = require("../../Domains/jorong/entities/CreateJorong");

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

  async getJorong(queryParams) {
    return this._jorongRepository.getJorong(queryParams);
  }

  async updateJorong(id, useCasePayload) {
    const createJorong = new CreateJorong(useCasePayload);

    await this._nagariRepository.getNagariById(createJorong.nagariId);
    await this._jorongRepository.verifyAvailableJorongName(createJorong.name);

    return this._jorongRepository.updateJorong(id, createJorong);
  }

  async deleteJorong(id) {
    this._jorongRepository.findJorongById(id);
    return this._jorongRepository.deleteJorong(id);
  }
}

module.exports = JorongUseCase;
