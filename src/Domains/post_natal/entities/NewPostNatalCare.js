const DomainBase = require("../../DomainBase");

class NewPostNatalCare extends DomainBase {
  constructor(payload) {
    super(payload)

    const {
      maternalHistoryId,
      dateOfVisit,
      jorongId,
      midwifeId,
      bloodPressure,
      temperature,
      vitA,
      fe,
      contactType,
    } = this.output()

    this.maternalHistoryId = maternalHistoryId
    this.dateOfVisit = dateOfVisit
    this.jorongId = jorongId
    this.midwifeId = midwifeId
    this.bloodPressure = bloodPressure
    this.temperature = temperature
    this.vitA = vitA || false
    this.fe = fe || false
    this.contactType = contactType
  }

  _verifyPayload() {
    this.isRequired("maternalHistoryId", "string")
    this.isRequired("dateOfVisit", "string")
    this.isRequired("jorongId", "string")
    this.isRequired("midwifeId", "string")
    this.isRequired("contactType", "string")
    this.isOptional("bloodPressure", "number")
    this.isOptional("temperature", "number")
    this.isOptional("vitA", "boolean")
    this.isOptional("fe", "boolean")
  }
}

module.exports = NewPostNatalCare;