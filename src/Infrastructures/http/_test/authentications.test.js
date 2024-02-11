const pool = require("../../database/postgres/pool");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const PlacementsTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - authentications", () => {
  let token;

  beforeEach(async () => {
    token = await authenticateUser("user-123", "admin");
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await PlacementsTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /api/v1/login", () => {
    it("should response 201 and persisted authentication", async () => {
      // Arrange
      const requestPayload = {
        email: "user-test@gmail.com",
        password: "password",
      };
      const server = await createServer(container);

      // inject data
      await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: "user-test@gmail.com",
          password: "password",
          name: "test",
          role: "admin",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/login",
        payload: {
          email: requestPayload.email,
          password: requestPayload.password,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it("should reponse 401 if password wrong", async () => {
      // Arrange
      const requestPayload = {
        email: "user@mail.com",
        password: "password",
      };

      const server = await createServer(container);

      // inject data
      await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: requestPayload.email,
          password: requestPayload.password,
          name: "test",
          role: "admin",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/login",
        payload: {
          email: requestPayload.email,
          password: "wrong_password",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "kredensial yang Anda masukkan salah"
      );
    });

    it("should reponse 400 if request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        email: "user@mail.com",
        password: "password",
      };

      const server = await createServer(container);

      // inject data
      await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: requestPayload.email,
          password: requestPayload.password,
          name: "test",
        },
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/login",
        payload: {
          email: requestPayload.email,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "harus mengirimkan email dan password"
      );
    });

    it("should reponse 400 if request payload not meet data type specification", async () => {
      // Arrange
      const server = await createServer(container);

      // inject data
      await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: "user@mail.com",
          password: "password",
          name: "test",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/login",
        payload: {
          email: 1234,
          password: "password",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "autentikasi gagal, payload tidak sesuai"
      );
    });
  });

  describe("when GET /api/v1/auth", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        email: "user@mail.com",
        password: "password",
        name: "dicoding",
        role: "admin",
      });

      await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    });

    it("should response 200 and return authenticated user", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toEqual("user-123");
      expect(responseJson.data.name).toEqual("dicoding");
      expect(responseJson.data.email).toEqual("user@mail.com");
      expect(responseJson.data.role).toEqual("admin");
      expect(responseJson.data.placements).toEqual([]);
    });

    it("should response 401 if access token not valid", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/auth",
        headers: {
          Authorization: `Bearer invalid_token`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("You are not authenticated");
    });

    it("should response 200 with placements data", async () => {
      // Arrange
      const server = await createServer(container);
      await PlacementsTableTestHelper.addPlacement({
        midwifeId: "user-123",
        jorongId: "jorong-123",
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toEqual("user-123");
      expect(responseJson.data.name).toEqual("dicoding");
      expect(responseJson.data.email).toEqual("user@mail.com");
      expect(responseJson.data.role).toEqual("admin");
      expect(responseJson.data.placements).toHaveLength(1);
    });

    it("should response 404 if user not found", async () => {
      // Arrange
      const server = await createServer(container);
      token = await authenticateUser("user-124", "admin");

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
