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

describe("HTTP server", () => {
  let token = "";

  beforeAll(async () => {
    await AnteNatalCaresTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await PlacementsTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "user123", role: 'midwife' });
    await UsersTableTestHelper.addUser({ id: "user-124", username: "user124", role: 'mother' });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await PlacementsTableTestHelper.addPlacement({ id: "placement-123", midwifeId: "user-123", jorongId: "jorong-123"});
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId: "user-124" });
    await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-123" });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-123" });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-124", dateOfVisit: "2022-01-01" });
  });

  afterEach(async () => {
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
    it ("should response 200", async () => {
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

    it ("should response 200 with correct value when has other history", async () => {
      const server = await createServer(container);

      await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-124", maternalId: "maternal-123" });
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-125", maternalHistoryId: "maternal-history-124"});

      token = await authenticateUser("user-123", "midwife");

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternal_services/maternal/maternal-123/latest",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.id).toEqual("ante-natal-care-125");
    });

    it ("should return 403 when user is mother and access other resource", async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: "user-126", username: "user124", role: 'mother' });
      await MaternalTableTestHelper.addMaternal({ id: "maternal-126", userId: "user-126" });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-126" });
      await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-127", maternalHistoryId: "maternal-history-126" });

      token = await authenticateUser("user-126", "mother");

      const response = await server.inject({
        method: "GET",
        url: "/api/v1/maternal_services/maternal/maternal-123/latest",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      expect(response.statusCode).toEqual(403);
    });
  });
});

