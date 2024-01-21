const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");

describe("HTTP server - maternal", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
  });

  describe("when POST /api/v1/maternals", () => {
    it("should response 201 and persisted maternal", async () => {
      // Arrange
      const requestPayload = {
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        maritalStatus: "married",
        numberOfMarriage: "2",
        jorongId: "jorong-123",
      };

      const server = await createServer(container);

      // Action
      const userResponse = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload: {
          email: "test-email@mail.com",
          password: "secret_password",
          name: "User Test",
        },
      });

      expect(userResponse.statusCode).toEqual(201);
      const { id } = JSON.parse(userResponse.payload).data.createdUser;

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternals",
        payload: { ...requestPayload, userId: id },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toBeDefined();

      const maternal = await MaternalTableTestHelper.findMaternalById(
        responseJson.data.id
      );
      expect(maternal).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternals",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when POST /api/v1/maternals/user", () => {
    it("should response 200 and presist user and maternal", async () => {
      // Arrange
      const useCasePayload = {
        name: "User test",
        email: "test@mail.com",
        password: "secret",
        role: "mother",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "Jalan jalan",
        birthplace: "Padang",
        jobTitle: "IRT",
        dateOfBirth: "2021-08-22",
        religion: "Islam",
        isActiveBpjs: true,
        bpjsKesehatanNumber: "1234567890123456",
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: "1",
        maritalStatus: "single",
        jorongId: "jorong-123",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternals/user",
        payload: useCasePayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toBeDefined();

      const maternal = await MaternalTableTestHelper.findMaternalById(
        responseJson.data.id
      );
      expect(maternal).toBeDefined();

      const user = await UsersTableTestHelper.findUserById(maternal.user_id);
      expect(user).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternals/user",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 400 when request payload data type is wrong", async () => {
      // Arrange
      const useCasePayload = {
        name: "User test",
        email: "test@mail.com",
        password: "secret",
        role: "mother",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "Jalan jalan",
        birthplace: "Padang",
        jobTitle: "IRT",
        dateOfBirth: "2021-08-22",
        religion: "Islam",
        isActiveBpjs: true,
        bpjsKesehatanNumber: "1234567890123456",
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: 1,
        maritalStatus: 1,
        jorongId: "jorong-123",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternals/user",
        payload: useCasePayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when GET /api/v1/maternals", () => {
    it("should response 200 and show all maternal", async () => {
      // Arrange
      const userId = "user-123";
      const maternalId = "maternal-123";
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({
        id: userId,
        name: "Test",
        nik: "1234",
      });
      await MaternalTableTestHelper.addMaternal({ id: maternalId, userId });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-123",
        maternalId,
        maternalStatus: "pregnant",
      });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-124",
        maternalId,
        maternalStatus: "postpartum",
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternals",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toHaveLength(1);
      expect(responseJson.data[0].id).toEqual(maternalId);
      expect(responseJson.data[0].user_id).toEqual(userId);
      expect(responseJson.data[0].name).toEqual("Test");
    });
  });
});
