const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const PlacementsTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCaresTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const PostNatalCareTableTestHelper = require("../../../../tests/PostNatalCareTableTestHelper");
const ChildrenTableTestHelper = require("../../../../tests/ChildrenTableTestHelper");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server", () => {
  let token = "";

  beforeAll(async () => {
    await ChildrenTableTestHelper.cleanTable();
    await PostNatalCareTableTestHelper.cleanTable();
    await AnteNatalCaresTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await PlacementsTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "user123", role: "midwife" });
    await UsersTableTestHelper.addUser({ id: "user-124", username: "user124", role: "mother" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await PlacementsTableTestHelper.addPlacement({ id: "placement-123", midwifeId: "user-123", jorongId: "jorong-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId: "user-124" });
    await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-123" });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-123" });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-124", dateOfVisit: "2022-01-01" });
  });

  afterEach(async () => {
    await ChildrenTableTestHelper.cleanTable();
    await PostNatalCareTableTestHelper.cleanTable();
    await AnteNatalCaresTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await PlacementsTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when GET /api/v1/maternal_services/maternal/{maternalId}/latest", () => {
    it("should response 200", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternal_services/maternal/maternal-123/latest",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.id).toEqual("ante-natal-care-124");
    });

    it("should response 200 with correct value when has other history", async () => {
      const server = await createServer(container);

      await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-124", maternalId: "maternal-123" });
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-125", maternalHistoryId: "maternal-history-124" });

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternal_services/maternal/maternal-123/latest",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.id).toEqual("ante-natal-care-125");
    });

    it("should return 403 when user is mother and access other resource", async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: "user-126", username: "user124", role: "mother" });
      await MaternalTableTestHelper.addMaternal({ id: "maternal-126", userId: "user-126" });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-126" });
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-127", maternalHistoryId: "maternal-history-126" });

      token = await authenticateUser("user-126", "mother");

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternal_services/maternal/maternal-123/latest",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(403);
    });
  });

  describe("POST /api/v1/maternal_services/post_natal_care", () => {
    it("should response 201", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/post_natal_care",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-123",
          jorongId: "jorong-123",
          bloodPressure: 120,
          temperature: 36,
          dateOfVisit: "2021-08-21",
          vitA: false,
          fe: false,
          postNatalType: "pnc_1",
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.id).toBeDefined();
      expect(responseJson.data.bloodPressure).toEqual(120);
      expect(responseJson.data.temperature).toEqual(36);
      expect(responseJson.data.vitA).toEqual(false);
      expect(responseJson.data.fe).toEqual(false);
      expect(responseJson.data.postNatalType).toEqual("pnc_1");
    });

    it("should response 422 when payload not complete", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/post_natal_care",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-123",
          jorongId: "jorong-123",
          bloodPressure: 120,
          temperature: 36,
          vitA: false,
          fe: false,
        },
      });

      expect(response.statusCode).toEqual(422);
    });

    it("should response 403 when user is mother", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-124", "mother");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/post_natal_care",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-123",
          jorongId: "jorong-123",
          bloodPressure: 120,
          temperature: 36,
          vitA: false,
          fe: false,
          postNatalType: "pnc_1",
        },
      });

      expect(response.statusCode).toEqual(403);
    });
  });

  describe("POST /api/v1/maternal_services/deliver_child", () => {
    it("should response 201", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/deliver_child",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalId: "maternal-123",
          maternalHistoryId: "maternal-history-123",
          name: "test",
          nik: "123",
          birthDatetime: "2021-08-22",
          birthWeight: 3,
          birthHeight: 50,
          gender: "L",
          fatherName: "test",
          pregnancyAge: 9,
          deliveryPlace: "PUSKESMAS",
          deliveryMethod: "NORMAL",
          helper: "DUKUN",
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.id).toBeDefined();

      const child = await ChildrenTableTestHelper.findChildById(responseJson.data.id);
      expect(child).toBeDefined();
    });

    it("should update maternal_history to postpartum", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/deliver_child",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalId: "maternal-123",
          maternalHistoryId: "maternal-history-123",
          name: "test",
          nik: "123",
          birthDatetime: "2021-08-22",
          birthWeight: 3,
          birthHeight: 50,
          gender: "L",
          fatherName: "test",
          pregnancyAge: 9,
          deliveryPlace: "PUSKESMAS",
          deliveryMethod: "NORMAL",
          helper: "DUKUN",
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.id).toBeDefined();

      const maternalHistory = await MaternalHistoriesTableTestHelper.findMaternalHistoryById("maternal-history-123");
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.maternal_status).toEqual("postpartum");
    });
  });

  describe("POST /api/v1/maternal_services/complications", () => {
    it("should response 201", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/complications",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-123",
          complicationType: "abortus",
          description: "",
          isHandled: false,
          isReferred: false,
          comeCondition: "alive",
          backCondition: "dead",
          complicationDate: "2021-08-21",
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.id).toBeDefined();

      const maternalHistory = await MaternalHistoriesTableTestHelper.findMaternalHistoryById("maternal-history-123");
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.maternal_status).toEqual("abortion");
    });

    it("should response 422 when payload not complete", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/complications",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-123",
          complicationType: "abortus",
          description: "",
          isHandled: false,
          isReferred: false,
          comeCondition: "alive",
          backCondition: "dead",
        },
      });

      expect(response.statusCode).toEqual(422);
    });

    it("should response 403 when user is mother", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-124", "mother");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/complications",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(403);
    });

    it("should response 404 when maternal history not found", async () => {
      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/complications",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-124",
          complicationType: "abortus",
          description: "",
          isHandled: false,
          isReferred: false,
          comeCondition: "alive",
          backCondition: "dead",
          complicationDate: "2021-08-21",
        },
      });

      expect(response.statusCode).toEqual(404);
    });
  });

  describe("POST /api/v1/maternal_services/ante_natal_care", () => {
    it("should response 201 and create maternal histories when c1", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-125", username: "user125", role: "mother" });
      await MaternalTableTestHelper.addMaternal({ id: "maternal-125", userId: "user-125" });

      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/ante_natal_care",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalId: "maternal-125",
          jorongId: "jorong-123",
          height: 160,
          weight: 50,
          hemoglobin: 12,
          bloodPressure: 160,
          fundalHeight: 20,
          fetalHeartRate: 120,
          usgCheckDate: "2021-08-21",
          temprature: 36,
          action: "test",
          upperArmCircumference: 20,
          contactType: "c1",
          periodDuration: 5,
          periodAmount: 2,
          periodConcern: "test",
          periodCycle: 28,
          lastIllness: "test",
          gemeli: false,
          hpht: "2021-08-01",
          weightBeforePregnancy: 50,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.id).toBeDefined();

      const maternalHistory = await MaternalHistoriesTableTestHelper.findMaternalHistoryById(responseJson.data.maternalHistoryId);
      expect(maternalHistory).toBeDefined();
    });

    it("should response 201 and update risk when category passed", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-125", username: "user125", role: "mother" });
      await MaternalTableTestHelper.addMaternal({ id: "maternal-125", userId: "user-125" });

      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/ante_natal_care",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalId: "maternal-125",
          jorongId: "jorong-123",
          height: 160,
          weight: 50,
          hemoglobin: 12,
          bloodPressure: 150,
          fundalHeight: 20,
          fetalHeartRate: 120,
          usgCheckDate: "2021-08-21",
          temprature: 36,
          action: "test",
          upperArmCircumference: 20,
          contactType: "c1",
          periodDuration: 5,
          periodAmount: 2,
          periodConcern: "test",
          periodCycle: 28,
          lastIllness: "test",
          gemeli: false,
          hpht: "2021-08-01",
          weightBeforePregnancy: 50,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);

      const maternalHistory = await MaternalHistoriesTableTestHelper.findMaternalHistoryById(responseJson.data.maternalHistoryId);
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.risk_status).toEqual("high_risk");
    });

    it("should response 201 and not update risk when updated category has lower risk", async () => {
      await MaternalHistoriesTableTestHelper.updateRiskStatus("maternal-history-123", "high_risk");
      const oldMh = await MaternalHistoriesTableTestHelper.findMaternalHistoryById("maternal-history-123");
      expect(oldMh.risk_status).toEqual("high_risk");

      const server = await createServer(container);

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "POST",
        url: "/api/v1/maternal_services/ante_natal_care",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          maternalHistoryId: "maternal-history-123",
          jorongId: "jorong-123",
          height: 160,
          weight: 50,
          hemoglobin: 12,
          bloodPressure: 120,
          fundalHeight: 20,
          fetalHeartRate: 120,
          usgCheckDate: "2021-08-21",
          temprature: 36,
          action: "test",
          upperArmCircumference: 20,
          contactType: "c1",
          periodDuration: 5,
          periodAmount: 2,
          periodConcern: "test",
          periodCycle: 28,
          lastIllness: "test",
          gemeli: false,
          hpht: "2021-08-01",
          weightBeforePregnancy: 50,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);

      const maternalHistory = await MaternalHistoriesTableTestHelper.findMaternalHistoryById(responseJson.data.maternalHistoryId);
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.risk_status).toEqual("high_risk");
    });
  });
});
