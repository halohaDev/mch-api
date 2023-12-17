const DomainBase = require("../../DomainBase");

class MaternalHistory extends DomainBase {
  constructor(payload) {
    super(payload);

    this.verifyPayload();

    this.maternalId = payload.maternalId;
    this.periodDuration = payload.periodDuration;
    this.periodAmount = payload.periodAmount;
    this.periodConcern = payload.periodConcern;
    this.periodCycle = payload.periodCycle;
    this.lastIllness = payload.lastIllness;
    this.gemeli = payload.gemeli;
    this.edd = payload.edd;
    this.hpht = payload.hpht;
    this.weightBeforePregnancy = payload.weightBeforePregnancy;
    this.maternalStatus = payload.maternalStatus;
  }

  verifyPayload() {
    this.isRequired("maternalId", "string");
    this.isRequired("maternalStatus", "string");
  }
}
