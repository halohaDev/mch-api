const DomainBase = require("../../DomainBase");

class NewMaternalHistory extends DomainBase {
  constructor(payload) {
    super(payload);

    const {
      maternalId,
      periodDuration,
      periodAmount,
      periodConcern,
      periodCycle,
      lastIllness,
      gemeli,
      edd,
      hpht,
      weightBeforePregnancy,
      maternalStatus,
    } = this.output();

    this.maternalId = maternalId;
    this.periodDuration = periodDuration;
    this.periodAmount = periodAmount;
    this.periodConcern = periodConcern;
    this.periodCycle = periodCycle;
    this.lastIllness = lastIllness;
    this.gemeli = gemeli;
    this.edd = edd;
    this.hpht = hpht;
    this.weightBeforePregnancy = weightBeforePregnancy;
    this.maternalStatus = maternalStatus;
  }

  _verifyPayload() {
    this.isRequired("maternalId", "string");
    this.isRequired("maternalStatus", "string");
    this.isOptional("periodDuration", "number");
    this.isOptional("periodAmount", "number");
    this.isOptional("periodConcern", "string");
    this.isOptional("periodCycle", "string");
    this.isOptional("lastIllness", "string");
    this.isOptional("gemeli", "string");
    this.isOptional("edd", "date");
    this.isOptional("hpht", "string");
    this.isOptional("weightBeforePregnancy", "number");
  }
}

module.exports = NewMaternalHistory;
