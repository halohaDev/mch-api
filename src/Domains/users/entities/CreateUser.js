const DomainBase = require("../../DomainBase");

class CreateUser extends DomainBase {
  constructor(payload) {
    super(payload);

    const {
      role,
      email,
      password,
      name,
      nik,
      phoneNumber,
      address,
      birthplace,
      dateOfBirth,
      jobTitle,
      religion,
      isActiveBpjs,
      bpjsKesehatanNumber,
    } = this.output();

    this.role = role;
    this.email = email;
    this.password = password;
    this.name = name;
    this.nik = nik;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.birthplace = birthplace;
    this.dateOfBirth = dateOfBirth;
    this.jobTitle = jobTitle;
    this.religion = religion;
    this.isActiveBpjs = isActiveBpjs;
    this.bpjsKesehatanNumber = bpjsKesehatanNumber;
  }

  _verifyPayload(payload) {
    this.isRequired("role", "string");
    this.isRequired("email", "string");
    this.isRequired("password", "string");
    this.isRequired("name", "string");

    if (payload.role === "mother") {
      this.isRequired("nik", "string");
      this.isRequired("phoneNumber", "string");
      this.isRequired("address", "string");
      this.isRequired("birthplace", "string");
      this.isRequired("dateOfBirth", "date");
      this.isRequired("jobTitle", "string");
      this.isRequired("religion", "string");
      this.isRequired("isActiveBpjs", "boolean");
      this.isRequired("bpjsKesehatanNumber", "string");
    } else {
      this.isOptional("nik", "string");
      this.isOptional("phoneNumber", "string");
      this.isOptional("address", "string");
      this.isOptional("birthplace", "string");
      this.isOptional("dateOfBirth", "date");
      this.isOptional("jobTitle", "string");
      this.isOptional("religion", "string");
      this.isOptional("isActiveBpjs", "boolean");
      this.isOptional("bpjsKesehatanNumber", "string");
    }
  }
}

module.exports = CreateUser;
