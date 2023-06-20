const CreateNagari = require('../../Domains/nagari/entities/CreateNagari');
const ShowNagari = require('../../Domains/nagari/entities/ShowNagari');

class NagariUseCase {
  constructor({ nagariRepository }) {
    this._nagariRepository = nagariRepository;
  }

  async addNagari(useCasePayload) {
    const createNagari = new CreateNagari(useCasePayload);
    await this._nagariRepository.verifyAvailableNagariName(createNagari.name);
    const createdNagari = await this._nagariRepository.addNagari(createNagari);
    return new ShowNagari(createdNagari);
  }
}

module.exports = NagariUseCase;