const Authenticated = require("../Authenticated");
const UnprocessableError = require("../../../../Commons/exceptions/UnprocessableError");

describe("Authenticated entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "user-123",
      email: "user@mail.com",
      name: "user",
    };

    // Action & Assert
    expect(() => new Authenticated(payload)).toThrowError(UnprocessableError);
  });

  it("should create Authenticated object correctly", () => {
    // Arrange
    const payload = {
      id: "user-123",
      email: "user@mail.com",
      name: "user",
      role: "user",
      placements: [{ id: "placement-123", name: "placement" }],
    };

    // Action
    const { id, email, name, role, placements } = new Authenticated(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(email).toEqual(payload.email);
    expect(name).toEqual(payload.name);
    expect(role).toEqual(payload.role);
    expect(placements).toEqual(payload.placements);
  });

  it("should create Authenticated object correctly without placements", () => {
    // Arrange
    const payload = {
      id: "user-123",
      email: "user@mail.com",
      name: "user",
      role: "user",
    };

    // Action
    const { id, email, name, role, placements } = new Authenticated(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(email).toEqual(payload.email);
    expect(name).toEqual(payload.name);
    expect(role).toEqual(payload.role);
    expect(placements).toEqual([]);
  });
});
