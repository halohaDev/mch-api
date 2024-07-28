const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const ChildCareTableTestHelper = require("../../../../tests/ChildCaresTableTestHelper");
const ChildrenTableTestHelper = require("../../../../tests/ChildrenTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - child cares", () => {
  let token;

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ChildCareTableTestHelper.cleanTable();
    await ChildrenTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    token = await authenticateUser("user-123", "midwife");

    await UsersTableTestHelper.addUser({ id: "midwife-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await UsersTableTestHelper.addUser({ id: "mother-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId: "mother-123" });
    await ChildrenTableTestHelper.addChild({ id: "child-123" });
  });

  describe("when POST /api/v1/child_cares", () => {
    it("should response 201 and persisted child care", async () => {
      // Arrange
      const requestPayload = {
        childId: "child-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        maternalId: "maternal-123",
        headCircumference: "30",
        childCareType: "bayi",
        weight: "3",
        height: "50",
        dateOfVisit: "2021-01-01T00:00:00.000Z",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/child_cares",
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
    });

    it("should response 422 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/child_cares",
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

  describe("when GET /api/v1/child_cares", () => {
    it("should response 200 and return child cares", async () => {
      // Arrange
      const server = await createServer(container);

      ChildCareTableTestHelper.addChildCare({
        id: "child-care-123",
        childId: "child-123",
        midwifeId: "midwife-123",
        childCareType: "bayi",
        jorongId: "jorong-123",
        maternalId: "maternal-123",
        birthDatetime: "2021-01-01T00:00:00.000Z",
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/child_cares",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toHaveLength(1);
    });

    it("should response 200 and return child cares with include child", async () => {
      // Arrange
      const server = await createServer(container);

      await ChildCareTableTestHelper.addChildCare({
        id: "child-care-123",
        childId: "child-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        maternalId: "maternal-123",
        birthDatetime: "2021-01-01T00:00:00.000Z",
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/child_cares?includeChild=true",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data[0].child).toBeDefined();
    });

    it("should response 200 and reutrn child according to query params", async () => {
      // Arrange
      const server = await createServer(container);

      ChildCareTableTestHelper.addChildCare({
        id: "child-care-123",
        childId: "child-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        maternalId: "maternal-123",
        birthDatetime: "2021-01-01T00:00:00.000Z",
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/child_cares?includeChild=true&jorongId=1234",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data).toHaveLength(0);
      expect(responseJson.status).toEqual("success");
    });
  });

  describe("when PUT /api/v1/child_cares/{id}", () => {
    it("should response 200 and return success status", async () => {
      // Arrange
      const server = await createServer(container);

      await ChildCareTableTestHelper.addChildCare({
        childId: "child-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        maternalId: "maternal-123",
        headCircumference: "30",
        weight: "3",
        height: "50",
        dateOfVisit: "2021-01-01T00:00:00.000Z",
      });

      const requestPayload = {
        childId: "child-123",
        midwifeId: "midwife-123",
        childCareType: "bayi",
        jorongId: "jorong-123",
        maternalId: "maternal-123",
        headCircumference: "30",
        weight: "2",
        height: "50",
        dateOfVisit: "2021-01-01T00:00:00.000Z",
      };

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/api/v1/child_cares/child-care-123",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      const childCares = await ChildCareTableTestHelper.findChildCareById("child-care-123");
      expect(childCares.weight).toEqual(2);
    });

    it("should response 404 when child care not found", async () => {
      // Arrange
      const server = await createServer(container);

      const requestPayload = {
        childId: "child-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        headCircumference: "30",
        childCareType: "bayi",
        maternalId: "maternal-123",
        weight: "3",
        height: "50",
        dateOfVisit: "2021-01-01T00:00:00.000Z",
      };

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/api/v1/child_cares/child-care-123",
        payload: requestPayload,
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

  describe("when DELETE /api/v1/child_cares/{id}", () => {
    it("should response 200 and return success status", async () => {
      // Arrange
      const server = await createServer(container);

      await ChildCareTableTestHelper.addChildCare({
        childId: "child-123",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        headCircumference: "30",
        maternalId: "maternal-123",
        weight: "3",
        height: "50",
        dateOfVisit: "2021-01-01T00:00:00.000Z",
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/v1/child_cares/child-care-123",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      const childCares = await ChildCareTableTestHelper.findChildCareById("child-care-123");
      expect(childCares).toBeUndefined();
    });

    it("should response 404 when child care not found", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/v1/child_cares/child-care-123",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 403 when user not authorized", async () => {
      // Arrange
      const server = await createServer(container);
      token = await authenticateUser("user-123", "mother");

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/v1/child_cares/child-care-123",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
