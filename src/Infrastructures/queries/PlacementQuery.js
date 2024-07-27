const BaseQuery = require("./BaseQuery");

class PlacementQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getByJorongId(jorongId) {
    return ["jorong_id = ?", jorongId];
  }

  getByMidwifeId(midwifeId) {
    return ["midwife_id = ?", midwifeId];
  }
}

module.exports = PlacementQuery;
