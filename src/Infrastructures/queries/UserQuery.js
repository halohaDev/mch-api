const BaseQuery = require("./BaseQuery");

class UserQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getByName(name) {
    return ["name = ? ", name];
  }

  getByEmail(email) {
    return ["email = ? ", email];
  }

  getByRole(role) {
    return ["role =  ?", role];
  }

  getBySearch(query) {
    return ["name LIKE %?% ", query];
  }

  getById(id) {
    return ["id = ?", id];
  }
}

module.exports = UserQuery;
