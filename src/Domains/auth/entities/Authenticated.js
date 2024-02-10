const DomainBase = require("../../DomainBase");

class Authenticated extends DomainBase {
  constructor(payload) {
    super(payload);

    const { id, email, name, role, placements } = this.output();

    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.placements = placements || [];
  }

  _verifyPayload() {
    this.isRequired("id", "string");
    this.isRequired("email", "email");
    this.isRequired("name", "string");
    this.isRequired("role", "string");
    this.isOptional("placements", "array");
  }
}

module.exports = Authenticated;
