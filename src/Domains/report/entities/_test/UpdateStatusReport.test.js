const UpdateStatusReport = require("../UpdateStatusReport");

describe("a UpdateStatusReport entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      note: "note",
    };

    // Action and Assert
    expect(() => new UpdateStatusReport(payload)).toThrowError();
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      status: "status",
      note: 2021,
    };

    // Action and Assert
    expect(() => new UpdateStatusReport(payload)).toThrowError();
  });

  it("should createUpdateStatusReport object correctly", () => {
    // Arrange
    const payload = {
      status: "approved",
      note: "note",
    };

    // Action
    const { status, note } = new UpdateStatusReport(payload);

    // Assert
    expect(status).toEqual(payload.status);
    expect(note).toEqual(payload.note);
  });
});
