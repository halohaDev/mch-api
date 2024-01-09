const AddAnteNatalCare = require("../AddAnteNatalCare");

describe("a AddAnteNatalCare entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      placementId: "placement-123",
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
      sugarInUrine: "sugarInUrine",
      hbsag: "hbsag",
      hiv: "hiv",
      syphilis: "syphilis",
    };

    // Action and Assert
    expect(() => new AddAnteNatalCare(payload)).toThrowError(
      "ADD_ANTE_NATAL_CARE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
});
