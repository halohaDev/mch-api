const MaternalComplicationRepositoryPostgres = require("../../repository/MaternalComplicationRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const MaternalComplicationsTableTestHelper = require("../../../../tests/MaternalComplicationsTableTestHelper");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("MaternalComplicationRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await MaternalComplicationsTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });
    await MaternalHistoryTableTestHelper.addMaternalHistory({ id: "maternal-history-123" });
  });

  describe("addMaternalComplication function", () => {
    it("should persist add maternal complication and return maternal complication id correctly", async () => {
      // Arrange
      const payload = {
        maternalHistoryId: "maternal-history-123",
        complicationType: "abortus",
        description: "",
        isHandled: false,
        isReferred: false,
        comeCondition: "alive",
        backCondition: "dead",
        complicationDate: "2021-08-21",
      };
      const fakeIdGenerator = () => "123";
      const maternalComplicationRepositoryPostgres = new MaternalComplicationRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await maternalComplicationRepositoryPostgres.addMaternalComplication(payload);

      // Assert
      const savedData = await MaternalComplicationsTableTestHelper.findMaternalComplicationById("mc-123");
      expect(savedData).toBeDefined();
      expect(savedData.maternal_history_id).toEqual("maternal-history-123");
      expect(savedData.complication_type).toEqual("abortus");
      expect(savedData.description).toEqual("");
      expect(savedData.is_handled).toEqual(false);
      expect(savedData.is_referred).toEqual(false);
      expect(savedData.come_condition).toEqual("alive");
      expect(savedData.back_condition).toEqual("dead");
      expect(savedData.complication_date).toBeDefined();
    });
  });
});
