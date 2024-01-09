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
    } = this._payload;

    this.placementId = placementId;
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
    isRequired(payload.placementId, "string");
    isRequired(payload.contactType, "string");
    isOptional(payload.action, "string");
    isOptional(payload.ttImunization, "string");

    const contactDirectories = {
      c1: this.#addFirstContact,
      c2: this.#addSecondContact,
      c3: this.#addThirdContact,
      c4: this.#addFourthContact,
      c5: this.#addFifthContact,
      c6: this.#addSixthContact,
      c0: this.#addNonContact,
    };

    contactDirectories[payload.contactType](payload);
  }

  #addFirstContact(payload) {
    this.#validateRequired(payload);

    isRequired(payload.height, "number");
    isRequired(payload.hemoglobin, "number");
    isRequired(payload.bloodType, "string");
    isRequired(payload.usgCheckDate, "string");
  }

  #addSecondContact(payload) {
    this.#validateRequired(payload);

    isRequired(payload.proteinInUrine, "string");
  }

  #addThirdContact(payload) {
    this.#validateRequired(payload);
  }

  #addFourthContact(payload) {
    this.#validateRequired(payload);

    isRequired(payload.hemoglobin, "number");
  }

  #addFifthContact(payload) {
    this.#validateRequired(payload);

    isRequired(payload.hemoglobin, "number");
    isRequired(payload.usgCheckDate, "string");
  }

  #addSixthContact(payload) {
    this.#validateRequired(payload);
  }

  #addNonContact(payload) {
    isOptional(payload.weight, "number");
    isOptional(payload.height, "number");
    isOptional(payload.hemoglobin, "number");
    isOptional(payload.bloodPressure, "number");
  }

  #validateRequired(payload) {
    isRequired(payload.weight, "number");
    isRequired(payload.bloodPressure, "number");
    isRequired(payload.fundalHeight, "number");
    isRequired(payload.fetalHeartRate, "number");
    isRequired(payload.hbsag, "string");
    isRequired(payload.hiv, "string");
    isRequired(payload.syphilis, "string");
  }
}

module.exports = AddAnteNatalCare;
