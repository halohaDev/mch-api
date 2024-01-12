const AddAnteNatal = require("../../../Domains/ante_natal/entities/AddAnteNatalCare");

class AddAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository, maternalHistoryRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
  }

  async execute(payload) {
    const { maternalId } = payload;

    const maternalHistory = await this.#getActiveMaternalHistory(maternalId);
    const updatedMaternalHistory = await this.#updateOrCreateMaternalHistory(
      payload,
      maternalHistory
    );

    // TODO: Get Id From Placement autenticated user
    const placementId = "placement-123";

    const updatedPayload = {
      ...payload,
      placementId,
      maternalHistoryId: updatedMaternalHistory.id,
    };

    const addAnteNatal = new AddAnteNatal(updatedPayload);

    await this._anteNatalCareRepository.addAnteNatalCare(addAnteNatal);
  }

  async #getActiveMaternalHistory(maternalId) {
    const mh =
      await this._maternalHistoryRepository.getMaternalHistoryByMaternalId(
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

  async #updateOrCreateMaternalHistory(payload, maternalHistory) {
    if (maternalHistory === null) {
      return await this._maternalHistoryRepository.addMaternalHistory(payload);
    }

    const { id: maternalHistoryId } = maternalHistory;

    return await this._maternalHistoryRepository.updateMaternalHistoryById({
      id: maternalHistoryId,
      maternalStatus: "pregnant",
    });
  }
}

module.exports = AddAnteNatalCareUseCase;
