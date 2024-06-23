const AddAnteNatal = require("../../../Domains/ante_natal/entities/AddAnteNatalCare");
const AddMaternalHistory = require("../../../Domains/maternal/entities/NewMaternalHistory");

class AddAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository, maternalHistoryRepository, databaseManager }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._databaseManager = databaseManager;
  }

  async execute(payload) {
    const { maternalId } = payload;

    try {
      this._databaseManager.beginTransaction();

      const maternalHistory = await this.#getActiveMaternalHistory(maternalId);
      const updatedMaternalHistoryId = await this.#updateOrCreateMaternalHistory(
        payload,
        maternalHistory
      );
  
      const updatedPayload = {
        ...payload,
        maternalHistoryId: updatedMaternalHistoryId,
      };
  
      const addAnteNatal = new AddAnteNatal(updatedPayload);
  
      const result = await this._anteNatalCareRepository.addAnteNatalCare(
        addAnteNatal
      );

      this._databaseManager.commitTransaction();
  
      return result;
    } catch (error) {
      this._databaseManager.rollbackTransaction();
      throw error;
    } finally {
      this._databaseManager.releaseClient();
    }
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
    if (payload.contactType === "c0") {
      payload.maternalStatus = "non_pregnant";
    }

    if (payload.contactType === "c1") {
      payload.maternalStatus = "pregnant";
    }

    if (maternalHistory === null) {
      const addMaternalHistory = new AddMaternalHistory(payload);

      const newMaternalHistory =
        await this._maternalHistoryRepository.addMaternalHistory(
          addMaternalHistory
        );
      return newMaternalHistory.id;
    }

    if (payload.contactType === "c0") {
      return maternalHistory.id;
    }

    const { id: maternalHistoryId } = maternalHistory;

    const result =
      await this._maternalHistoryRepository.updateMaternalHistoryById(
        maternalHistoryId,
        { maternalStatus: "pregnant" }
      );

    return result.id;
  }
}

module.exports = AddAnteNatalCareUseCase;
