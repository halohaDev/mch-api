const NewMaternalComplication = require("../../Domains/complication/entities/NewMaternalComplication");

class AddMaternalComplicationUseCase {
  constructor({ maternalComplicationRepository, maternalHistoryRepository }) {
    this._maternalComplicationRepository = maternalComplicationRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
  }

  async execute(payload) {
    const { maternalHistoryId } = payload;

    await this._maternalHistoryRepository.getMaternalHistoryById(maternalHistoryId);
    const newMaternalComplication = new NewMaternalComplication(payload);
    return await this._maternalComplicationRepository.addMaternalComplication(newMaternalComplication);
  }
}

module.exports = AddMaternalComplicationUseCase;
