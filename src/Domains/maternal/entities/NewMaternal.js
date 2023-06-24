const DomainBase = require('../../DomainBase');

class NewMaternal extends DomainBase {
  // create class with constructor method and camelCase
  constructor(payload) {
    super(payload);
    this._verifyPayload();

    this.userId = payload.userId;
    this.menarcheDate = payload.menarcheDate;
    this.martialDate = payload.martialDate;
    this.numberOfMarriage = payload.numberOfMarriage;
    this.martialStatus = payload.martialStatus;
  }

  _verifyPayload() {
    this.isRequired('userId', 'string');
    this.isRequired('menarcheDate', 'date');
    this.isRequired('martialDate', 'date');
    this.isRequired('numberOfMarriage', 'number');
    this.isRequired('martialStatus', 'string');
  }
}

module.exports = NewMaternal;
