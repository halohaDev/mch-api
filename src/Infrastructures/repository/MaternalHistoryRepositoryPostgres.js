const MaternalHistoryRepository = require("../../Domains/maternal/MaternalHistoryRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class MaternalHistoryRepositoryPostgres extends MaternalHistoryRepository {
  constructor(pool, idGenerator, snakeToCamel) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamel = snakeToCamel;
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
      text: `INSERT INTO maternal_histories(
          id, maternal_id, period_duration, period_amount, period_concern, period_cycle, last_illness, current_illness, gemeli, edd, hpht, weight_before_pregnancy, maternal_status
        ) VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning id
      `,
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

    const result = await this._pool.query(query);
    return this._snakeToCamel(result.rows[0]);
  }

  async getMaternalHistoryByMaternalId(maternalId) {
    const query = {
      text: "SELECT * FROM maternal_histories WHERE maternal_id = $1 ORDER BY created_at DESC",
      values: [maternalId],
    };

    const { rows } = await this._pool.query(query);

    return this._snakeToCamel(rows);
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

    return this._snakeToCamel(rows[0]);
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
      riskStatus,
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
      toBeUpdatedRiskStatus,
      createdAt,
    } = {
      toBeUpdatedPeriodDuration: periodDuration || maternalHistory.periodDuration,
      toBeUpdatedPeriodAmount: periodAmount || maternalHistory.periodAmount,
      toBeUpdatedPeriodConcern: periodConcern || maternalHistory.periodConcern,
      toBeUpdatedPeriodCycle: periodCycle || maternalHistory.periodCycle,
      toBeUpdatedLastIllness: lastIllness || maternalHistory.lastIllness,
      toBeUpdatedCurrentIllness: currentIllness || maternalHistory.currentIllness,
      toBeUpdatedGemeli: gemeli || maternalHistory.gemeli,
      toBeUpdatedEdd: edd || maternalHistory.edd,
      toBeUpdatedHpht: hpht || maternalHistory.hpht,
      toBeUpdatedWeightBeforePregnancy: weightBeforePregnancy || maternalHistory.weightBeforePregnancy,
      toBeUpdatedMaternalStatus: maternalStatus || maternalHistory.maternalStatus,
      toBeUpdatedRiskStatus: riskStatus || maternalHistory.riskStatus,
    };

    const query = {
      text: "UPDATE maternal_histories SET period_duration = $1, period_amount = $2, period_concern = $3, period_cycle = $4, last_illness = $5, current_illness = $6, gemeli = $7, edd = $8, hpht = $9, weight_before_pregnancy = $10, maternal_status = $11, risk_status = $13 WHERE id = $12 RETURNING id",
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
        toBeUpdatedRiskStatus,
      ],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async getMaternalHistories() {
    const query = {
      text: "SELECT * FROM maternal_histories",
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async getLatestMaternalHistoryByMaternalId(id) {
    const query = {
      text: `SELECT * FROM maternal_histories WHERE maternal_id = $1 ORDER BY created_at DESC LIMIT 1`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("maternal history tidak ditemukan");
    }

    return rows[0];
  }

  async updateRiskStatus(id, riskStatus) {
    const query = {
      text: "UPDATE maternal_histories SET risk_status = $1 WHERE id = $2 RETURNING id",
      values: [riskStatus, id],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }
}

module.exports = MaternalHistoryRepositoryPostgres;
