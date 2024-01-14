const UnprocessableError = require("../UnprocessableError");

describe("UnprocessableError", () => {
  it("should throw error correctly", () => {
    const unprocessableError = new UnprocessableError("sample message");

    expect(unprocessableError.message).toEqual("Unprocessable Entity");
    expect(unprocessableError.name).toEqual("UnprocessableError");
    expect(unprocessableError.statusCode).toEqual(422);
  });
});
