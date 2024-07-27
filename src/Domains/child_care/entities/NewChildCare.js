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
    this.isRequired("childId");
    this.isRequired("jorongId");
    this.isRequired("midwifeId");
    this.isRequired("weight");
    this.isRequired("height");
    this.isOptional("headCircumference");
    this.isOptional("notes");
    this.isRequired("dateOfVisit");
  }
}

module.exports = NewChildCare;
