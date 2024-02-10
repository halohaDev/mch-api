const pool = require("../../database/postgres/pool");
const NagariTableTestHelper = require("../../../../tests/NagariTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - nagari", () => {
  let token;

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await NagariTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    token = await authenticateUser("user-123", "admin");
  });

  describe("when POST /api/v1/nagari", () => {
    it("should response 201 and persisted nagari", async () => {
      // Arrange
      const requestPayload = {
        name: "Nagari Test",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toBeDefined();

      const nagari = await NagariTableTestHelper.findNagariById(
        responseJson.data.id
      );
      expect(nagari).toHaveLength(1);
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat nagari baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        name: ["Nagari Test"],
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should reponse 400 when nagari name has been used", async () => {
      // Arrange
      const requestPayload = {
        name: "Nagari Test",
      };

      const server = await createServer(container);

      // Action
      await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 401 when request not contain access token", async () => {
      // Arrange
      const requestPayload = {
        name: "Nagari Test",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it("should response 403 when request made by non admin user", async () => {
      // Arrange
      token = await authenticateUser("user-123", "member");
      const requestPayload = {
        name: "Nagari Test",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/nagari",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });
  });
});
