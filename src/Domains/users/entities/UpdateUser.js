const DomainBase = require("../../DomainBase");

class UpdateUserPetugas extends DomainBase {
  constructor(payload) {
    super(payload);

    const {
      id,
      name,
      email,
      role,
      nik,
      address,
      phoneNumber,
    } = this.output();

    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.nik = nik;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }

  _verifyPayload() {
    this.isRequired("id", "string");
    this.isRequired("name", "string");
    this.isRequired("email", "string");
    this.isRequired("role", "string");
    this.isRequired("nik", "string");
    this.isRequired("address", "string");
    this.isRequired("phoneNumber", "number");
  }
}

module.exports = UpdateUserPetugas;