const NewMaternal = require("../NewMaternal");

describe("NewMaternal entity", () => {
  it("should create a new maternal", () => {
    const maternal = new NewMaternal({
      userId: "1",
      menarcheDate: "2020-01-01",
      maritalDate: "2020-01-01",
      numberOfMarriage: "1",
      maritalStatus: "marriage",
    });

    expect(maternal).toEqual({
      userId: "1",
      menarcheDate: "2020-01-01",
      maritalDate: "2020-01-01",
      numberOfMarriage: "1",
      maritalStatus: "marriage",
    });
  });

  it("should throw error when payload not contain needed property", () => {
    expect(
      () =>
        new NewMaternal({
          userId: "1",
          menarcheDate: "2020-01-01",
          maritalDate: "2020-01-01",
          numberOfMarriage: "1",
        })
    ).toThrowError("Unprocessable Entity");
  });

  it("should throw error when payload not meet data type specification", () => {
    expect(
      () =>
        new NewMaternal({
          userId: "1",
          menarcheDate: "2020-01-01",
          maritalDate: "2020-01-01",
          numberOfMarriage: "1",
          maritalStatus: 1,
        })
    ).toThrowError("Unprocessable Entity");
  });
});
