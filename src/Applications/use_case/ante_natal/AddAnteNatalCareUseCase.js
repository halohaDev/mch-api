const AddAnteNatal = require("../../../Domains/ante_natal/entities/AddAnteNatalCare");
const AddMaternalHistory = require("../../../Domains/maternal/entities/NewMaternalHistory");

class AddAnteNatalCareUseCase {
  constructor({ anteNatalCareRepository, maternalHistoryRepository, databaseManager, userRepository, dateHelper, childRepository }) {
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._databaseManager = databaseManager;
    this._userRepository = userRepository;
    this._childRepository = childRepository;
    this._dateHelper = dateHelper;
  }

  async execute(payload) {
    const { maternalId, maternalHistoryId } = payload;

    try {
      this._databaseManager.beginTransaction();

      let maternalHistory = null;
      if (!!maternalHistoryId) {
        maternalHistory = await this._maternalHistoryRepository.getMaternalHistoryById(maternalHistoryId);
      } else {
        maternalHistory = await this.#getActiveMaternalHistory(maternalId);
        const newMaternalHistoryId = await this.#updateOrCreateMaternalHistory(payload, maternalHistory);
      }

      const riskStatus = await this.#calculateRiskStatus(payload, maternalHistory);

      await this._maternalHistoryRepository.updateRiskStatus(maternalHistoryId, riskStatus);

      const updatedPayload = {
        ...payload,
        maternalHistoryId: maternalHistoryId || newMaternalHistoryId,
        riskStatus: riskStatus || "normal",
      };

      const addAnteNatal = new AddAnteNatal(updatedPayload);

      const result = await this._anteNatalCareRepository.addAnteNatalCare(addAnteNatal);

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
    const results = await this._maternalHistoryRepository.getMaternalHistoryByMaternalId(maternalId);

    if (results.length === 0) {
      return null;
    }

    const activeMaternalHistory = results.find(
      (maternalHistory) => maternalHistory.maternal_status === "pregnant" || maternalHistory.maternal_status === "non_pregnant"
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

      const edd = this.#calculateEdd(payload.hpht);
      payload.edd = edd;
    }

    if (maternalHistory === null) {
      const addMaternalHistory = new AddMaternalHistory(payload);

      const newMaternalHistory = await this._maternalHistoryRepository.addMaternalHistory(addMaternalHistory);
      return newMaternalHistory.id;
    }

    if (payload.contactType === "c0") {
      return maternalHistory.id;
    }

    const { id: maternalHistoryId } = maternalHistory;

    const result = await this._maternalHistoryRepository.updateMaternalHistoryById(maternalHistoryId, { maternalStatus: "pregnant" });

    return result.id;
  }

  #calculateEdd(hpht, periodCycle) {
    const currentCycle = periodCycle || 28;
    const deviation = currentCycle - 28;
    const formula = 280 + deviation;

    return this._dateHelper.addDays(hpht, formula);
  }

  async #calculateRiskStatus(payload, maternalHistory) {
    const { weight, upperArmCircumference, bloodPressure, hemoglobin, height } = payload;
    const { maternalId, id: maternalHistoryId } = maternalHistory;

    const childs = await this._childRepository.getChildByMaternalId(maternalId);
    const { dateOfBirth } = await this._userRepository.getUserById(maternalId);

    const age = this._dateHelper.getDiffInYears(dateOfBirth);
    let paritasDiff = 25;
    let paritas = 0;
    let scHistory = null;

    if (childs.length > 0) {
      paritas = childs.length;
      const { dateOfBirth: lastChildBirth } = childs[childs.length - 1];
      paritasDiff = this._dateHelper.getDiffInYears(lastChildBirth);

      scHistory = childs.find((child) => child.birthMethod === "sc");
    }

    let riskStatus = "normal";
    const riskFactor =
      weight < 38 ||
      upperArmCircumference < 23.5 ||
      hemoglobin < 11 ||
      height < 145 ||
      age < 20 ||
      age > 35 ||
      paritas > 4 ||
      paritasDiff < 2;

    const highRisk = bloodPressure > 140 || hemoglobin < 8 || !!scHistory;

    if (riskFactor) {
      riskStatus = "risk";
    } else if (highRisk) {
      riskStatus = "high_risk";
    }

    return riskStatus;
  }
}

module.exports = AddAnteNatalCareUseCase;
