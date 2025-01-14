const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - maternal", () => {
  let token;

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
    token = await authenticateUser("user-123", "admin");
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
          role: "admin",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(userResponse.statusCode).toEqual(201);
      const { id } = JSON.parse(userResponse.payload).data.createdUser;

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternals",
        payload: { ...requestPayload, userId: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toBeDefined();

      const maternal = await MaternalTableTestHelper.findMaternalById(responseJson.data.id);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when POST /api/v1/maternals/user", () => {
    it("should response 201 and presist user and maternal", async () => {
      // Arrange
      const useCasePayload = {
        name: "User test",
        email: "test@mail.com",
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toBeDefined();

      const maternal = await MaternalTableTestHelper.findMaternalById(responseJson.data.id);
      expect(maternal).toBeDefined();

      const user = await UsersTableTestHelper.findUserById(maternal.user_id);
      expect(user).toBeDefined();
    });

    it("should resposne 201 and presist user and maternal with random password", async () => {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);

      const maternal = await MaternalTableTestHelper.findMaternalById(responseJson.data.id);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toHaveLength(1);
      expect(responseJson.data[0].id).toEqual(maternalId);
      expect(responseJson.data[0].userId).toEqual(userId);
      expect(responseJson.data[0].name).toEqual("Test");
    });
  });

  describe("when GET /api/v1/maternals/{id}", () => {
    it("should response 200 and show maternal by id", async () => {
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

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/api/v1/maternals/${maternalId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.id).toEqual(maternalId);
      expect(responseJson.data.userId).toEqual(userId);
      expect(responseJson.data.user.name).toEqual("Test");
    });

    it("should response 404 when maternal not found", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternals/maternal-123",
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

  describe("when GET /api/v1/maternals/{id}/history", () => {
    it("should response 200 and show maternal history by maternal id", async () => {
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
        url: `/api/v1/maternals/${maternalId}/history`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toHaveLength(2);
      expect(responseJson.data[0].maternalId).toEqual(maternalId);
    });

    it("should response empty array when maternal history not found", async () => {
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

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/api/v1/maternals/${maternalId}/histories`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toHaveLength(0);
    });
  });
});
