const MaternalHistory = require("../MaternalHistory");

describe("MaternalHistory entity", () => {
  it("should create maternalHistory entity correctly", () => {
    const maternalHistory = new MaternalHistory({
      maternalId: "1",
      periodDuration: "1",
      periodAmount: "1",
      periodConcern: "1",
      periodCycle: "1",
      lastIllness: "1",
      gemeli: "1",
      edd: "1",
      hpht: "1",
      weightBeforePregnancy: "1",
      maternalStatus: "1",
    });

    expect(maternalHistory).toEqual({
      maternalId: "1",
      periodDuration: "1",
      periodAmount: "1",
      periodConcern: "1",
      periodCycle: "1",
      lastIllness: "1",
      gemeli: "1",
      edd: "1",
      hpht: "1",
      weightBeforePregnancy: "1",
      maternalStatus: "1",
    });
  });

  it("should throw error when payload did not contain needed property", () => {
    expect(
      () =>
        new MaternalHistory({
          maternalId: "1",
          periodDuration: "1",
          periodAmount: "1",
          periodConcern: "1",
          periodCycle: "1",
          lastIllness: "1",
          gemeli: "1",
          edd: "1",
          hpht: "1",
          weightBeforePregnancy: "1",
        })
    ).toThrowError("MATERNAL_HISTORY.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    expect(
      () =>
        new MaternalHistory({
          maternalId: "1",
          periodDuration: "1",
          periodAmount: "1",
          periodConcern: "1",
          periodCycle: "1",
          lastIllness: "1",
          gemeli: "1",
          edd: "1",
          hpht: "1",
          weightBeforePregnancy: "1",
          maternalStatus: 1,
        })
    ).toThrowError("MATERNAL_HISTORY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });
});
