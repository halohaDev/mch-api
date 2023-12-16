const BaseQuery = require("./BaseQuery");

class UserQuery extends BaseQuery {
  constructor({ pool }) {
    super({ pool });
  }

  getByName(name) {
    return [`name = '${name}'`, name];
  }

  getByEmail(email) {
    return [`email = '${email}'`, email];
  }

  getByRole(role) {
    return [`role = '${role}'`, role];
  }

  getBySearch(query) {
    return [`name LIKE '%${search}%'`, query];
  }
}

module.exports = UserQuery;
