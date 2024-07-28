const BaseQuery = require("./BaseQuery");

class ChildCare extends BaseQuery {
  constructor({ pool }) {
    super({ pool });

    this.tableName = "children";
  }

  joinByMaternals() {
    return `INNER JOIN maternals ON children.maternal_id = maternals.id`;
  }

  getByJorongId(jorongId) {
    return [`jorong_id = ?`, jorongId];
  }

  getByMaternalNik(nik) {
    return [`maternals.nik LIKE ?`, `%${nik}%`];
  }

  getByStartDate(startDate) {
    return [`children.birth_datetime >= ?`, startDate];
  }

  getByEndDate(endDate) {
    return [`children.birth_datetime <= ?`, endDate];
  }

  getByMaternalHistoryId(maternalHistoryId) {
    return [`maternal_history_id = ?`, maternalHistoryId];
  }

  getById(id) {
    return [`children.id = ?`, id];
  }

  getByMaternalId(maternalId) {
    return [`maternal_id = ?`, maternalId];
  }

  orderByBirthDatetime(direction) {
    return [`birth_datetime`, direction];
  }
}

module.exports = ChildCare;
