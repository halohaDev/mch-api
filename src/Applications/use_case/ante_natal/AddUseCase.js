const AddAnteNatal = require("../../../Domains/ante_natal/entities/AddAnteNatal");
const AddMaternalHistory = require("../../../Domains/maternal_history/entities/AddMaternalHistory");

class AddUseCase {
  constructor({
    anteNatalRepository,
    maternalHistoryRepository,
    maternalRepository,
  }) {
    this.anteNatalRepository = anteNatalRepository;
    this.maternalHistoryRepository = maternalHistoryRepository;
    this.maternalRepository = maternalRepository;
  }

  async execute(payload) {
    const { maternalId } = payload;
    const maternalHistory = await this.#getActiveMaternalHistory(maternalId);

    let maternalHistoryId = null;
    if (!maternalHistory) {
      maternalHistoryId =
        await this.maternalHistoryRepository.addMaternalHistory(payload);
    } else {
      maternalHistoryId =
        await this.maternalHistoryRepository.updateMaternalHistoryStatus(
          "pregnant"
        );
    }

    const updatedPayload = { ...payload, maternalHistoryId: maternalHistoryId };
    const addAnteNatal = new AddAnteNatal(updatedPayload);

    await this.anteNatalRepository.addAnteNatal(addAnteNatal);
  }

  async #getActiveMaternalHistory(maternalId) {
    const mh =
      await this.maternalHistoryRepository.getMaternalHistoryByMaternalId(
        maternalId
      );

    if (
      mh.maternal_status === "pregnant" ||
      mh.maternal_status === "non_pregnant"
    ) {
      return mh;
    }

    return null;
  }
}

module.exports = AddUseCase;
