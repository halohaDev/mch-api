const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server", () => {
  let token;

  beforeEach(async () => {
    token = await authenticateUser("user-123", "admin");
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /users", () => {
    it("should handle server error correctly", async () => {
      // Arrange
      const payload = {
        email: "user@mail.com",
        password: "password",
        name: "user test",
      };

      const server = await createServer({});

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(500);
      expect(responseJson.status).toEqual("error");

      expect(responseJson.message).toEqual(
        "Maaf, terjadi kegagalan pada server kami."
      );
    });

    it("should response 404 when request unregistered route", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/unregisteredRoute",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });
});
