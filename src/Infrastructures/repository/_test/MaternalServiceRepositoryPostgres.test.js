const MaternalServiceRepositoryPostgres = require("../MaternalServiceRepositoryPostgres");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCaresTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const { snakeToCamelObject } = require("../../../Commons/helper");
const PostNatalCareTableTestHelper = require("../../../../tests/PostNatalCareTableTestHelper");
const MaternalComplicationsTableTestHelper = require("../../../../tests/MaternalComplicationsTableTestHelper");

describe("MaternalServiceRepository", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await MaternalComplicationsTableTestHelper.cleanTable();
    await PostNatalCareTableTestHelper.cleanTable();
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
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-123", dateOfVisit: "2021-08-22" });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({ id: "ante-natal-care-124", contactType: "c4", dateOfVisit: "2021-08-21" });
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
    });
  });

  describe("getServiceByMaternalHistoryId", () => {
    it("should return all services correctly", async () => {
      // Arrange
      const maternalServiceRepository = new MaternalServiceRepositoryPostgres(pool, snakeToCamelObject);
      await PostNatalCareTableTestHelper.addPostNatalCare({
        id: "post-natal-care-123",
        dateOfVisit: "2021-08-23",
        maternalHistoryId: "maternal-history-123",
      });

      await MaternalComplicationsTableTestHelper.addMaternalComplication({
        id: "maternal-complication-123",
        maternalHistoryId: "maternal-history-123",
        complicationType: "others",
        complicationDate: "2021-08-1",
      });

      // Action
      const services = await maternalServiceRepository.getServiceByMaternalHistoryId("maternal-history-123");

      // Assert
      expect(services).toHaveLength(4);
      expect(services[0].id).toEqual("post-natal-care-123");
      expect(services[0].serviceType).toEqual("pnc");
      expect(services[0].subServiceType).toEqual("pnc_1");
      expect(services[1].id).toEqual("ante-natal-care-123");
      expect(services[1].serviceType).toEqual("anc");
      expect(services[1].subServiceType).toEqual("c1");
      expect(services[2].id).toEqual("ante-natal-care-124");
      expect(services[2].serviceType).toEqual("anc");
      expect(services[2].subServiceType).toEqual("c4");
      expect(services[3].id).toEqual("maternal-complication-123");
      expect(services[3].serviceType).toEqual("maternal_complication");
      expect(services[3].subServiceType).toEqual("others");
    });
  });
});
