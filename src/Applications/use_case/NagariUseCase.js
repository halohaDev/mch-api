const CreateNagari = require('../../Domains/nagari/entities/CreateNagari');
const ShowNagari = require('../../Domains/nagari/entities/ShowNagari');

class NagariUseCase {
  constructor({ nagariRepository }) {
    this._nagariRepository = nagariRepository;
  }

  async addNagari(useCasePayload) {
    await this._nagariRepository.verifyAvailableNagariName(useCasePayload.name);
    const createdNagari = await this._nagariRepository.addNagari(new CreateNagari(useCasePayload));
    return new ShowNagari(createdNagari);
  }
}

module.exports = NagariUseCase;