const CreateNagari = require("../../Domains/nagari/entities/CreateNagari");
const ShowNagari = require("../../Domains/nagari/entities/ShowNagari");

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

  async showNagari(useCasePayload) {
    const result = await this._nagariRepository.getNagari(useCasePayload);

    result?.data?.map((nagari) => {
      return new ShowNagari(nagari);
    });

    return result;
  }

  async deleteNagari(useCasePayload) {
    const { id } = useCasePayload;
    return this._nagariRepository.deleteNagari(id);
  }

  async updateNagari(id, useCasePayload) {
    const updateNagari = new CreateNagari(useCasePayload);
    return this._nagariRepository.updateNagari(id, updateNagari);
  }
}

module.exports = NagariUseCase;
