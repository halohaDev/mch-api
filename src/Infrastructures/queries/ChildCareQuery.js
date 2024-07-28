const BaseQuery = require("./BaseQuery");

class ChildCare extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "child_cares";
  }

  getByJorongId(jorongId) {
    return [`jorong_id = ?`, jorongId];
  }

  getByChildId(childId) {
    return [`child_id = ?`, childId];
  }

  getByStartDate(startDate) {
    return [`date_of_visit >= ?`, startDate];
  }

  getByEndDate(endDate) {
    return [`date_of_visit <= ?`, endDate];
  }
}

module.exports = ChildCare;
