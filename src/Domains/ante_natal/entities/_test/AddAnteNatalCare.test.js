const AddAnteNatalCare = require("../AddAnteNatalCare");

describe("a AddAnteNatalCare entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      contactType: "c1",
      weight: 50,
      height: 160,
      hemoglobin: 12,
      bloodPressure: "120/80",
      fundalHeight: 0,
      fetalHeartRate: 0,
      usgCheckDate: "2021-08-01",
      temprature: 36,
      action: "action",
      bloodType: "bloodType",
      ttImunization: "ttImunization",
      proteinInUrine: "proteinInUrine",
      bloodSugar: "bloodSugar",
      hbsag: "hbsag",
      hiv: "hiv",
      syphilis: "syphilis",
    };

    // Action and Assert
    expect(() => new AddAnteNatalCare(payload)).toThrowError(
      "Unprocessable Entity"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      contactType: "c1",
      weight: "50",
      height: 160,
      hemoglobin: 12,
      bloodPressure: "120/80",
      fundalHeight: 1,
      fetalHeartRate: 2,
      usgCheckDate: "2021-08-01",
      temprature: 36,
      action: "action",
      bloodType: "bloodType",
      ttImunization: "ttImunization",
      proteinInUrine: "proteinInUrine",
      bloodSugar: "bloodSugar",
      hbsag: "hbsag",
      hiv: "hiv",
      syphilis: "syphilis",
      maternalHistoryId: "maternalHistory-123",
      artGiven: "artGiven",
      upperArmCircumference: 10,
      jorongId: "jorong-123",
      midwifeId: "midwife-123",
    };

    // Action and Assert
    expect(() => new AddAnteNatalCare(payload)).toThrowError(
      "Unprocessable Entity"
    );
  });

  it("should create addAnteNatalCare object correctly", () => {
    // Arrange
    const payload = {
      contactType: "c1",
      weight: 50,
      height: 160,
      hemoglobin: 12,
      bloodPressure: "120",
      fundalHeight: 1,
      fetalHeartRate: 2,
      usgCheckDate: "2021-08-01",
      temprature: 36,
      action: "action",
      bloodType: "bloodType",
      ttImunization: "ttImunization",
      proteinInUrine: "proteinInUrine",
      bloodSugar: "bloodSugar",
      hbsag: "hbsag",
      hiv: "hiv",
      syphilis: "syphilis",
      maternalHistoryId: "maternalHistory-123",
      artGiven: true,
      upperArmCircumference: 10,
      jorongId: "jorong-123",
      midwifeId: "midwife-123",
    };

    // Action
    const addAnteNatalCare = new AddAnteNatalCare(payload);

    // Assert
    expect(addAnteNatalCare).toBeInstanceOf(AddAnteNatalCare);
    expect(addAnteNatalCare.contactType).toEqual(payload.contactType);
    expect(addAnteNatalCare.weight).toEqual(payload.weight);
    expect(addAnteNatalCare.height).toEqual(payload.height);
    expect(addAnteNatalCare.hemoglobin).toEqual(payload.hemoglobin);
    expect(addAnteNatalCare.bloodPressure).toEqual(payload.bloodPressure);
    expect(addAnteNatalCare.fundalHeight).toEqual(payload.fundalHeight);
    expect(addAnteNatalCare.fetalHeartRate).toEqual(payload.fetalHeartRate);
    expect(addAnteNatalCare.usgCheckDate).toEqual(payload.usgCheckDate);
    expect(addAnteNatalCare.temprature).toEqual(payload.temprature);
    expect(addAnteNatalCare.action).toEqual(payload.action);
    expect(addAnteNatalCare.bloodType).toEqual(payload.bloodType);
    expect(addAnteNatalCare.ttImunization).toEqual(payload.ttImunization);
    expect(addAnteNatalCare.hbsag).toEqual(payload.hbsag);
    expect(addAnteNatalCare.hiv).toEqual(payload.hiv);
    expect(addAnteNatalCare.syphilis).toEqual(payload.syphilis);
    expect(addAnteNatalCare.maternalHistoryId).toEqual(
      payload.maternalHistoryId
    );
    expect(addAnteNatalCare.artGiven).toEqual(payload.artGiven);
    expect(addAnteNatalCare.upperArmCircumference).toEqual(
      payload.upperArmCircumference
    );
    expect(addAnteNatalCare.jorongId).toEqual(payload.jorongId);
    expect(addAnteNatalCare.midwifeId).toEqual(payload.midwifeId);
  });
});
