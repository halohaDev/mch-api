const DomainBase = require("../../DomainBase");

class NewPostNatalCare extends DomainBase {
  constructor(payload) {
    super(payload);

    const { maternalHistoryId, dateOfVisit, jorongId, midwifeId, bloodPressure, temperature, vitA, fe, postNatalType } = this.output();

    this.maternalHistoryId = maternalHistoryId;
    this.dateOfVisit = dateOfVisit;
    this.jorongId = jorongId;
    this.midwifeId = midwifeId;
    this.bloodPressure = bloodPressure;
    this.temperature = temperature;
    this.vitA = vitA || false;
    this.fe = fe || false;
    this.postNatalType = postNatalType;
  }

  _verifyPayload() {
    this.isRequired("maternalHistoryId", "string");
    this.isRequired("dateOfVisit", "string");
    this.isRequired("jorongId", "string");
    this.isRequired("midwifeId", "string");
    this.isRequired("postNatalType", "containOf", ["pnc_1", "pnc_2", "pnc_3", "pnc_4"]);
    this.isOptional("bloodPressure", "number");
    this.isOptional("temperature", "number");
    this.isOptional("vitA", "containOf", [true, false]);
    this.isOptional("fe", "containOf", [true, false]);
  }
}

module.exports = NewPostNatalCare;
