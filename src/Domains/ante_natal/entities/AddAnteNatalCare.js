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
    this.isOptional("placementId", "string");
    this.isRequired("contactType", "string");
    this.isRequired("maternalHistoryId", "string");
    this.isOptional("action", "string");
    this.isOptional("ttImunization", "string");

    if (payload.contactType === "c1") {
      this.isRequired("height", "number");
      this.isRequired("hemoglobin", "number");
      this.isRequired("bloodType", "string");
      this.isRequired("usgCheckDate", "string");
      this.isRequired("weight", "number");
      this.isRequired("bloodPressure", "number");
      this.isRequired("fundalHeight", "number");
      this.isRequired("fetalHeartRate", "number");
      this.isRequired("hbsag", "string");
      this.isRequired("hiv", "string");
      this.isRequired("syphilis", "string");
    } else if (payload.contactType === "c2") {
      this.isRequired("proteinInUrine", "string");
      this.isRequired("weight", "number");
      this.isRequired("bloodPressure", "number");
      this.isRequired("fundalHeight", "number");
      this.isRequired("fetalHeartRate", "number");
      this.isRequired("hbsag", "string");
      this.isRequired("hiv", "string");
      this.isRequired("syphilis", "string");
    } else if (payload.contactType === "c3") {
      this.isRequired("weight", "number");
      this.isRequired("bloodPressure", "number");
      this.isRequired("fundalHeight", "number");
      this.isRequired("fetalHeartRate", "number");
      this.isRequired("hbsag", "string");
      this.isRequired("hiv", "string");
      this.isRequired("syphilis", "string");
    } else if (payload.contactType === "c4") {
      this.isRequired("weight", "number");
      this.isRequired("bloodPressure", "number");
      this.isRequired("fundalHeight", "number");
      this.isRequired("fetalHeartRate", "number");
      this.isRequired("hbsag", "string");
      this.isRequired("hiv", "string");
      this.isRequired("syphilis", "string");
      this.isRequired("hemoglobin", "number");
    } else if (payload.contactType === "c5") {
      this.isRequired("hemoglobin", "number");
      this.isRequired("usgCheckDate", "string");
      this.isRequired("weight", "number");
      this.isRequired("bloodPressure", "number");
      this.isRequired("fundalHeight", "number");
      this.isRequired("fetalHeartRate", "number");
      this.isRequired("hbsag", "string");
      this.isRequired("hiv", "string");
      this.isRequired("syphilis", "string");
    } else if (payload.contactType === "c6") {
      this.isRequired("weight", "number");
      this.isRequired("bloodPressure", "number");
      this.isRequired("fundalHeight", "number");
      this.isRequired("fetalHeartRate", "number");
      this.isRequired("hbsag", "string");
      this.isRequired("hiv", "string");
      this.isRequired("syphilis", "string");
    } else {
      this.isOptional("weight", "number");
      this.isOptional("height", "number");
      this.isOptional("hemoglobin", "number");
      this.isOptional("bloodPressure", "number");
    }
  }
}

module.exports = AddAnteNatalCare;
