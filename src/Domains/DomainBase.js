const Validator = require("./Validator");

class DomainBase extends Validator {
  constructor(payload) {
    super(payload);
    this._verifyPayload(payload);
  }

  _verifyPayload(payload) {
    throw new Error("BASE_DOMAIN.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = DomainBase;
