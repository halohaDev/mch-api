const DomainBase = require("../../DomainBase");

class NewMaternalComplication extends DomainBase {
  constructor(payload) {
    super(payload);

    const { maternalHistoryId, isHandled, isReferred, complicationType, description, comeCondition, backCondition, complicationDate } =
      this.output();

    this.maternalHistoryId = maternalHistoryId;
    this.isHandled = isHandled;
    this.isReferred = isReferred;
    this.complicationType = complicationType;
    this.description = description;
    this.comeCondition = comeCondition;
    this.backCondition = backCondition;
    this.complicationDate = complicationDate;
  }

  _verifyPayload() {
    this.isRequired("maternalHistoryId", "string");
    this.isRequired("isHandled", "containOf", [false, true]);
    this.isRequired("isReferred", "containOf", [true, false]);
    this.isRequired("complicationType", "containOf", ["abortus", "hdk", "kpd", "perdarahan", "infeksi", "distosia", "ppp", "others"]);
    this.isOptional("description", "string");
    this.isRequired("comeCondition", "containOf", ["alive", "dead"]);
    this.isRequired("backCondition", "containOf", ["alive", "dead"]);
    this.isRequired("complicationDate", "string");
  }
}

module.exports = NewMaternalComplication;
