const DomainBase = require("../../DomainBase");

class NewMaternal extends DomainBase {
  // create class with constructor method and camelCase
  constructor(payload) {
    super(payload);

    const {
      userId,
      menarcheDate,
      maritalDate,
      numberOfMarriage,
      maritalStatus,
    } = this.output();

    this.userId = userId;
    this.menarcheDate = menarcheDate;
    this.maritalDate = maritalDate;
    this.numberOfMarriage = numberOfMarriage;
    this.maritalStatus = maritalStatus;
  }

  _verifyPayload() {
    this.isRequired("userId", "string");
    this.isRequired("menarcheDate", "date");
    this.isRequired("maritalDate", "date");
    this.isRequired("numberOfMarriage", "number");
    this.isRequired("maritalStatus", "string");
  }
}

module.exports = NewMaternal;
