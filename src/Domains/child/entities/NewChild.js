const DomainBase = require("../../DomainBase");

class NewChild extends DomainBase {
  constructor(payload) {
    super(payload);

    const {
      name,
      nik,
      birthDatetime,
      birthWeight,
      birthHeight,
      gender,
      fatherName,
      pregnancyAge,
      deliveryPlace,
      deliveryMethod,
      helper,
      maternalId,
      maternalHistoryId,
    } = this.output();

    this.name = name;
    this.nik = nik;
    this.birthDatetime = birthDatetime;
    this.birthWeight = birthWeight;
    this.birthHeight = birthHeight;
    this.gender = gender;
    this.fatherName = fatherName;
    this.pregnancyAge = pregnancyAge;
    this.deliveryPlace = deliveryPlace;
    this.deliveryMethod = deliveryMethod;
    this.helper = helper;
    this.maternalId = maternalId;
    this.maternalHistoryId = maternalHistoryId;
  }

  _verifyPayload() {
    this.isRequired("name", "string");
    this.isRequired("nik", "string");
    this.isRequired("birthDatetime", "string");
    this.isRequired("birthWeight", "float");
    this.isRequired("birthHeight", "float");
    this.isRequired("gender", "string");
    this.isOptional("fatherName", "string");
    this.isRequired("pregnancyAge", "int");
    this.isRequired("deliveryPlace", "containOf", ["rs", "puskesmas", "klinik", "rumah", "bps", "polindes", "pustu", "klinik", "poskesri"]);
    this.isRequired("deliveryMethod", "containOf", ["normal", "sc", "vakum", "forceps"]);
    this.isRequired("helper", "containOf", ["dokter", "bidan", "perawat", "dukun"]);
    this.isRequired("maternalId", "string");
    this.isOptional("maternalHistoryId", "string");
  }
}

module.exports = NewChild;
