const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const PlacementsTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCaresTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - ante natal cares", () => {
  let token;

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AnteNatalCaresTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await PlacementsTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await UsersTableTestHelper.addUser({ id: "midwife-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await PlacementsTableTestHelper.addPlacement({ midwifeId: "midwife-123" });
    await MaternalTableTestHelper.addMaternal({ userId: "user-123" });
    await MaternalHistoriesTableTestHelper.addMaternalHistory({
      maternalId: "maternal-123",
    });

    token = await authenticateUser("user-123", "midwife");
  });

  describe("when POST /api/v1/ante_natal_cares", () => {
    it("should response 201 and persisted ante natal care", async () => {
      // Arrange
      const requestPayload = {
        maternalId: "maternal-123",
        contactType: "c0",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        bloodPressure: 120,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: "A",
        usgCheckDate: "2021-08-01",
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        upperArmCircumference: 10,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/ante_natal_cares",
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

      const anteNatalCare =
        await AnteNatalCaresTableTestHelper.findAnteNatalCareById(
          responseJson.data.id
        );
      expect(anteNatalCare).toHaveLength(1);
    });

    it("should response 422 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/ante_natal_cares",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Unprocessable Entity");
    });

    describe("when request to specific contact types", () => {
      describe("K1", () => {
        it("should throw error when request payload not contain needed property", async () => {
          // Arrange
          const requestPayload = {
            maternalId: "maternal-123",
            contactType: "c1",
            action: "action",
            ttImunization: "4",
            height: 160,
            hemoglobin: 12,
            weight: 50,
            bloodPressure: 120,
            fundalHeight: 10,
            fetalHeartRate: 120,
            hbsag: "negative",
            hiv: "negative",
            syphilis: "negative",
            midwifeId: "midwife-123",
            jorongId: "jorong-123",
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: "POST",
            url: "/api/v1/ante_natal_cares",
            payload: requestPayload,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(422);
          expect(responseJson.status).toEqual("fail");
          expect(responseJson.message).toEqual("Unprocessable Entity");
        });

        it("should response 201 and persisted ante natal care when request payload is valid", async () => {
          // Arrange
          const requestPayload = {
            maternalId: "maternal-123",
            contactType: "c1",
            action: "action",
            ttImunization: "4",
            height: 160,
            hemoglobin: 12,
            weight: 50,
            bloodPressure: 120,
            fundalHeight: 10,
            fetalHeartRate: 120,
            hbsag: "negative",
            hiv: "negative",
            syphilis: "negative",
            bloodType: "A",
            usgCheckDate: "2021-08-01",
            midwifeId: "midwife-123",
            jorongId: "jorong-123",
            upperArmCircumference: 10,
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: "POST",
            url: "/api/v1/ante_natal_cares",
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

          const anteNatalCare =
            await AnteNatalCaresTableTestHelper.findAnteNatalCareById(
              responseJson.data.id
            );
          expect(anteNatalCare).toHaveLength(1);
        });
      });

      describe("K2", () => {
        it("should throw error when request payload not contain needed property", async () => {
          // Arrange
          const requestPayload = {
            maternalId: "maternal-123",
            contactType: "c2",
            action: "action",
            ttImunization: "4",
            height: 160,
            hemoglobin: 12,
            weight: 50,
            bloodPressure: 120,
            fundalHeight: 10,
            fetalHeartRate: 120,
            hbsag: "negative",
            hiv: "negative",
            syphilis: "negative",
            bloodType: "A",
            usgCheckDate: "2021-08-01",
            midwifeId: "midwife-123",
            jorongId: "jorong-123",
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: "POST",
            url: "/api/v1/ante_natal_cares",
            payload: requestPayload,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(422);
          expect(responseJson.status).toEqual("fail");
          expect(responseJson.message).toEqual("Unprocessable Entity");
        });

        it("should response 201 and persisted ante natal care when request payload is valid", async () => {
          // Arrange
          const requestPayload = {
            maternalId: "maternal-123",
            contactType: "c2",
            action: "action",
            ttImunization: "4",
            height: 160,
            hemoglobin: 12,
            weight: 50,
            bloodPressure: 120,
            fundalHeight: 10,
            fetalHeartRate: 120,
            hbsag: "negative",
            hiv: "negative",
            syphilis: "negative",
            bloodType: "A",
            usgCheckDate: "2021-08-01",
            proteinInUrine: "negative",
            midwifeId: "midwife-123",
            jorongId: "jorong-123",
            upperArmCircumference: 10,
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: "POST",
            url: "/api/v1/ante_natal_cares",
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

          const anteNatalCare =
            await AnteNatalCaresTableTestHelper.findAnteNatalCareById(
              responseJson.data.id
            );
          expect(anteNatalCare).toHaveLength(1);
        });
      });

      describe("C4", () => {
        it("should throw error when request payload not contain needed property", async () => {
          // Arrange
          const requestPayload = {
            maternalId: "maternal-123",
            contactType: "c4",
            action: "action",
            ttImunization: "4",
            height: 160,
            weight: 50,
            bloodPressure: 120,
            fundalHeight: 10,
            fetalHeartRate: 120,
            hbsag: "negative",
            hiv: "negative",
            syphilis: "negative",
            bloodType: "A",
            usgCheckDate: "2021-08-01",
            midwifeId: "midwife-123",
            jorongId: "jorong-123",
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: "POST",
            url: "/api/v1/ante_natal_cares",
            payload: requestPayload,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(422);
          expect(responseJson.status).toEqual("fail");
          expect(responseJson.message).toEqual("Unprocessable Entity");
        });

        it("should response 201 and persisted ante natal care when request payload is valid", async () => {
          // Arrange
          const requestPayload = {
            maternalId: "maternal-123",
            contactType: "c4",
            action: "action",
            ttImunization: "4",
            height: 160,
            hemoglobin: 12,
            weight: 50,
            bloodPressure: 120,
            fundalHeight: 10,
            fetalHeartRate: 120,
            bloodSugar: 120,
            hbsag: "negative",
            hiv: "negative",
            syphilis: "negative",
            bloodType: "A",
            usgCheckDate: "2021-08-01",
            midwifeId: "midwife-123",
            jorongId: "jorong-123",
            upperArmCircumference: 10,
          };

          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: "POST",
            url: "/api/v1/ante_natal_cares",
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

          const anteNatalCare =
            await AnteNatalCaresTableTestHelper.findAnteNatalCareById(
              responseJson.data.id
            );

          expect(anteNatalCare).toHaveLength(1);
        });
      });
    });
  });

  describe("when GET /api/v1/ante_natal_cares", () => {
    it("should response 200 and return all ante natal cares", async () => {
      // Arrange
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "anc-123" });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/ante_natal_cares",
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

    it("should response 200 and return all ante natal cares with query", async () => {
      // Arrange
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({
        id: "anc-123",
        maternalHistoryId: "maternal-history-123",
      });

      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-345",
        maternalId: "maternal-123",
      });
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({
        id: "anc-456",
        maternalHistoryId: "maternal-history-345",
      });
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({
        id: "anc-789",
        maternalHistoryId: "maternal-history-345",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/ante_natal_cares?maternalHistoryId=maternal-history-345",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toHaveLength(2);
    });
  });
});
