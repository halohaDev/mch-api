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
    const results =
      await this._maternalHistoryRepository.getMaternalHistoryByMaternalId(
        maternalId
      );

    if (results.length === 0) {
      return null;
    }

    const activeMaternalHistory = results.find(
      (maternalHistory) =>
        maternalHistory.maternal_status === "pregnant" ||
        maternalHistory.maternal_status === "non_pregnant"
    );

    if (activeMaternalHistory) {
      return activeMaternalHistory;
    }

    return null;
  }

  async #updateOrCreateMaternalHistory(payload, maternalHistory) {
    if (maternalHistory === null) {
      return await this._maternalHistoryRepository.addMaternalHistory(payload);
    }

    const { id: maternalHistoryId } = maternalHistory;

    return await this._maternalHistoryRepository.updateMaternalHistoryById(
      maternalHistoryId,
      { maternalStatus: "pregnant" }
    );
  }
}

module.exports = AddAnteNatalCareUseCase;
