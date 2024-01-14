const MaternalHistoryRepository = require("../../Domains/maternal/MaternalHistoryRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class MaternalHistoryRepositoryPostgres extends MaternalHistoryRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addMaternalHistory({
    maternalId,
    periodDuration,
    periodAmount,
    periodConcern,
    periodCycle,
    lastIllness,
    currentIllness,
    gemeli,
    edd,
    hpht,
    weightBeforePregnancy,
    maternalStatus,
  }) {
    const idMaternalHistory = `maternal-history-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO maternal_histories(id, maternal_id, period_duration, period_amount, period_concern, period_cycle, last_illness, current_illness, gemeli, edd, hpht, weight_before_pregnancy, maternal_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)",
      values: [
        idMaternalHistory,
        maternalId,
        periodDuration,
        periodAmount,
        periodConcern,
        periodCycle,
        lastIllness,
        currentIllness,
        gemeli,
        edd,
        hpht,
        weightBeforePregnancy,
        maternalStatus,
      ],
    };

    await this._pool.query(query);
    return idMaternalHistory;
  }

  async getMaternalHistoryByMaternalId(maternalId) {
    const query = {
      text: "SELECT * FROM maternal_histories WHERE maternal_id = $1",
      values: [maternalId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async getMaternalHistoryById(id) {
    const query = {
      text: "SELECT * FROM maternal_histories WHERE id = $1 LIMIT 1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("maternal history tidak ditemukan");
    }

    return rows[0];
  }

  async updateMaternalHistoryById(
    id,
    {
      periodDuration,
      periodAmount,
      periodConcern,
      periodCycle,
      lastIllness,
      currentIllness,
      gemeli,
      edd,
      hpht,
      weightBeforePregnancy,
      maternalStatus,
    }
  ) {
    // find maternal history by id
    const maternalHistory = await this.getMaternalHistoryById(id);

    const {
      toBeUpdatedPeriodDuration,
      toBeUpdatedPeriodAmount,
      toBeUpdatedPeriodConcern,
      toBeUpdatedPeriodCycle,
      toBeUpdatedLastIllness,
      toBeUpdatedCurrentIllness,
      toBeUpdatedGemeli,
      toBeUpdatedEdd,
      toBeUpdatedHpht,
      toBeUpdatedWeightBeforePregnancy,
      toBeUpdatedMaternalStatus,
      createdAt,
    } = {
      toBeUpdatedPeriodDuration:
        periodDuration || maternalHistory.period_duration,
      toBeUpdatedPeriodAmount: periodAmount || maternalHistory.period_amount,
      toBeUpdatedPeriodConcern: periodConcern || maternalHistory.period_concern,
      toBeUpdatedPeriodCycle: periodCycle || maternalHistory.period_cycle,
      toBeUpdatedLastIllness: lastIllness || maternalHistory.last_illness,
      toBeUpdatedCurrentIllness:
        currentIllness || maternalHistory.current_illness,
      toBeUpdatedGemeli: gemeli || maternalHistory.gemeli,
      toBeUpdatedEdd: edd || maternalHistory.edd,
      toBeUpdatedHpht: hpht || maternalHistory.hpht,
      toBeUpdatedWeightBeforePregnancy:
        weightBeforePregnancy || maternalHistory.weight_before_pregnancy,
      toBeUpdatedMaternalStatus:
        maternalStatus || maternalHistory.maternal_status,
    };

    const query = {
      text: "UPDATE maternal_histories SET period_duration = $1, period_amount = $2, period_concern = $3, period_cycle = $4, last_illness = $5, current_illness = $6, gemeli = $7, edd = $8, hpht = $9, weight_before_pregnancy = $10, maternal_status = $11 WHERE id = $12 RETURNING id",
      values: [
        toBeUpdatedPeriodDuration,
        toBeUpdatedPeriodAmount,
        toBeUpdatedPeriodConcern,
        toBeUpdatedPeriodCycle,
        toBeUpdatedLastIllness,
        toBeUpdatedCurrentIllness,
        toBeUpdatedGemeli,
        toBeUpdatedEdd,
        toBeUpdatedHpht,
        toBeUpdatedWeightBeforePregnancy,
        toBeUpdatedMaternalStatus,
        id,
      ],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }
}

module.exports = MaternalHistoryRepositoryPostgres;
