const DomainBase = require("../../DomainBase");

class NewChildCare extends DomainBase {
  constructor(data) {
    super(data);

    const { childId, jorongId, midwifeId, weight, height, headCircumference, notes, dateOfVisit } = this.output();

    this.childId = childId;
    this.jorongId = jorongId;
    this.midwifeId = midwifeId;
    this.weight = weight;
    this.height = height;
    this.headCircumference = headCircumference;
    this.notes = notes;
    this.dateOfVisit = dateOfVisit;
  }

  _verifyPayload() {
    this.isRequired("childId", "string");
    this.isRequired("jorongId", "string");
    this.isRequired("midwifeId", "string");
    this.isRequired("weight", "number");
    this.isRequired("height", "number");
    this.isRequired("headCircumference", "number");
    this.isOptional("notes", "string");
    this.isRequired("dateOfVisit", "string");
  }
}

module.exports = NewChildCare;
