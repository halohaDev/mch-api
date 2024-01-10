const DomainBase = require("../../DomainBase");

class AddAnteNatalCare extends DomainBase {
  constructor(payload) {
    super(payload);

    const {
      placementId,
      contactType,
      weight,
      height,
      hemoglobin,
      bloodPressure,
      fundalHeight,
      fetalHeartRate,
      usgCheckDate,
      temprature,
      action,
      bloodType,
      ttImunization,
      proteinInUrine,
      sugarInUrine,
      hbsag,
      hiv,
      syphilis,
      maternalHistoryId,
    } = this.output();

    this.placementId = placementId;
    this.maternalHistoryId = maternalHistoryId;
    this.contactType = contactType;
    this.weight = weight;
    this.height = height;
    this.hemoglobin = hemoglobin;
    this.bloodPressure = bloodPressure;
    this.fundalHeight = fundalHeight;
    this.fetalHeartRate = fetalHeartRate;
    this.usgCheckDate = usgCheckDate;
    this.temprature = temprature;
    this.action = action;
    this.bloodType = bloodType;
    this.ttImunization = ttImunization;
    this.proteinInUrine = proteinInUrine;
    this.sugarInUrine = sugarInUrine;
    this.hbsag = hbsag;
    this.hiv = hiv;
    this.syphilis = syphilis;
  }

  _verifyPayload(payload) {
    this.isRequired("placementId", "string");
    this.isRequired("contactType", "string");
    this.isRequired("maternalHistoryId", "string");
    this.isOptional("action", "string");
    this.isOptional("ttImunization", "string");

    const contactDirectories = {
      c1: this._addFirstContact,
      c2: this._addSecondContact,
      c3: this._addThirdContact,
      c4: this._addFourthContact,
      c5: this._addFifthContact,
      c6: this._addSixthContact,
      c0: this._addNonContact,
    };

    contactDirectories[payload.contactType];
  }

  _addFirstContact(payload) {
    this.#validateRequired(payload);

    this.isRequired("height", "number");
    this.isRequired("hemoglobin", "number");
    this.isRequired("bloodType", "string");
    this.isRequired("usgCheckDate", "string");
  }

  _addSecondContact() {
    this.#validateRequired();

    this.isRequired("proteinInUrine", "string");
  }

  _addThirdContact() {
    this.#validateRequired();
  }

  _addFourthContact() {
    this.#validateRequired();

    this.isRequired("hemoglobin", "number");
  }

  _addFifthContact() {
    this.#validateRequired();

    this.isRequired("hemoglobin", "number");
    this.isRequired("usgCheckDate", "string");
  }

  _addSixthContact() {
    this.#validateRequired();
  }

  _addNonContact() {
    this.isOptional("weight", "number");
    this.isOptional("height", "number");
    this.isOptional("hemoglobin", "number");
    this.isOptional("bloodPressure", "number");
  }

  #validateRequired() {
    this.isRequired("weight", "number");
    this.isRequired("bloodPressure", "number");
    this.isRequired("fundalHeight", "number");
    this.isRequired("fetalHeartRate", "number");
    this.isRequired("hbsag", "string");
    this.isRequired("hiv", "string");
    this.isRequired("syphilis", "string");
  }
}

module.exports = AddAnteNatalCare;
