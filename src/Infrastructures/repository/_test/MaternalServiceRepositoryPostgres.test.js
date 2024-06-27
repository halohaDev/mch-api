const MaternalServiceRepositoryPostgres = require("../MaternalServiceRepositoryPostgres");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCaresTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const { snakeToCamelObject } = require("../../../Commons/helper");

describe("MaternalServiceRepository", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AnteNatalCaresTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });
    await MaternalHistoriesTableTestHelper.addMaternalHistory({ id: "maternal-history-123" });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-123", dateOfVisit: "2021-08-22"});
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-124", contactType: 'c4', dateOfVisit: "2021-08-21"});
  });

  describe("getLatestServiceByMaternalHistoryId", () => {
    it("should return latest service correctly", async () => {
      // Arrange
      const maternalServiceRepository = new MaternalServiceRepositoryPostgres(pool, snakeToCamelObject);

      // Action
      const service = await maternalServiceRepository.getLatestServiceByMaternalHistoryId("maternal-history-123");

      // Assert
      expect(service.id).toEqual("ante-natal-care-123");
      expect(service.serviceType).toEqual("anc");
      expect(service.subServiceType).toEqual("c1");
    })
  });
});
