const DomainBase = require("../../DomainBase");

class NewMaternal extends DomainBase {
  // create class with constructor method and camelCase
  constructor(payload) {
    super(payload);

    const {
      userId,
      menarcheDate,
      martialDate,
      numberOfMarriage,
      martialStatus,
    } = this.output();

    this.userId = userId;
    this.menarcheDate = menarcheDate;
    this.martialDate = martialDate;
    this.numberOfMarriage = numberOfMarriage;
    this.martialStatus = martialStatus;
  }

  _verifyPayload() {
    this.isRequired("userId", "string");
    this.isRequired("menarcheDate", "date");
    this.isRequired("martialDate", "date");
    this.isRequired("numberOfMarriage", "number");
    this.isRequired("martialStatus", "string");
  }
}

module.exports = NewMaternal;
