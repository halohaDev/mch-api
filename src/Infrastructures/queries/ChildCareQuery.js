const BaseQuery = require("./BaseQuery");

class ChildCare extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "child_cares";
  }

  joinByChilds() {
    return `INNER JOIN children ON child_cares.child_id = children.id`;
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

  getByName(name) {
    return [`children.name LIKE ?`, `%${name}%`];
  }

  orderByDateOfVisit(direction) {
    return [`date_of_visit`, direction];
  }
}

module.exports = ChildCare;
