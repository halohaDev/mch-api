const MaternalHistoryRepositoryPostgres = require("../MaternalHistoryRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("MaternalHistoryRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await MaternalHistoryTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });
  });

  describe("addMaternalHistory function", () => {
    it("should persist add maternal history and return maternal history id correctly", async () => {
      // Arrange
      const payload = {
        maternalId: "maternal-123",
        periodDuration: "5",
        periodAmount: "2",
        periodConcern: "test",
        periodCycle: "30",
        lastIllness: "test",
        currentIllness: "test",
        gemeli: "false",
        edd: "2021-08-22",
        hpht: "2021-08-22",
        weightBeforePregnancy: "50",
        maternalStatus: "pregnant",
      };
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const maternalHistoryId =
        await maternalHistoryRepositoryPostgres.addMaternalHistory(payload);

      // Assert
      const maternalHistory =
        await MaternalHistoryTableTestHelper.findMaternalHistoryById(
          maternalHistoryId
        );
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.id).toEqual("maternal-history-123");
      expect(maternalHistory.maternal_id).toEqual("maternal-123");
      expect(maternalHistory.period_duration).toEqual(5);
      expect(maternalHistory.period_amount).toEqual(2);
      expect(maternalHistory.period_concern).toEqual("test");
      expect(maternalHistory.period_cycle).toEqual(30);
      expect(maternalHistory.last_illness).toEqual("test");
      expect(maternalHistory.current_illness).toEqual("test");
      expect(maternalHistory.gemeli).toEqual(false);
      expect(maternalHistory.weight_before_pregnancy).toEqual(50);
      expect(maternalHistory.maternal_status).toEqual("pregnant");
      expect(maternalHistory.created_at).toBeDefined();
      expect(maternalHistory.updated_at).toBeDefined();
    });
  });

  describe("getMaternalHistoryById function", () => {
    it("should return maternal history correctly", async () => {
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);
      const maternalHistoryId = "maternal-history-123";
      await MaternalHistoryTableTestHelper.addMaternalHistory({
        id: maternalHistoryId,
        maternalId: "maternal-123",
      });

      // Action
      const maternalHistory =
        await maternalHistoryRepositoryPostgres.getMaternalHistoryById(
          maternalHistoryId
        );

      // Assert
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.id).toEqual("maternal-history-123");
      expect(maternalHistory.maternal_id).toEqual("maternal-123");
    });

    it("should throw NotFoundError when maternal history not found", async () => {
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        maternalHistoryRepositoryPostgres.getMaternalHistoryById(
          "maternal-history-123"
        )
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("getMaternalHistoryByMaternalId function", () => {
    it("should return maternal history correctly", async () => {
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);

      await MaternalHistoryTableTestHelper.addMaternalHistory({
        id: "maternal-history-123",
        maternalId: "maternal-123",
      });

      // Action
      const maternalHistory =
        await maternalHistoryRepositoryPostgres.getMaternalHistoryByMaternalId(
          "maternal-123"
        );

      // Assert
      expect(maternalHistory).toHaveLength(1);
    });

    it("should return empty array when maternal history not found", async () => {
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      const maternalHistory =
        await maternalHistoryRepositoryPostgres.getMaternalHistoryByMaternalId(
          "maternal-123"
        );

      // Assert
      expect(maternalHistory).toHaveLength(0);
    });
  });

  describe("updateMaternalHistoryById function", () => {
    it("should update maternal history correctly", async () => {
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);

      await MaternalHistoryTableTestHelper.addMaternalHistory({
        id: "maternal-history-123",
        maternalId: "maternal-123",
        period_duration: 5,
        period_amount: 2,
      });

      const payload = {
        maternalStatus: "abortion",
      };

      const previousMaternalHistory =
        await MaternalHistoryTableTestHelper.findMaternalHistoryById(
          "maternal-history-123"
        );

      const prevCreatedAt = previousMaternalHistory.created_at;
      const prevUpdatedAt = previousMaternalHistory.updated_at;

      // Action
      await maternalHistoryRepositoryPostgres.updateMaternalHistoryById(
        "maternal-history-123",
        payload
      );

      // Assert
      const maternalHistory =
        await MaternalHistoryTableTestHelper.findMaternalHistoryById(
          "maternal-history-123"
        );
      expect(maternalHistory).toBeDefined();
      expect(maternalHistory.maternal_status).toEqual("abortion");
      expect(maternalHistory.gemeli).toEqual(false);
      expect(maternalHistory.period_duration).toEqual(5);
      expect(maternalHistory.period_amount).toEqual(2);
      expect(maternalHistory.created_at).toEqual(prevCreatedAt);
      expect(maternalHistory.updated_at).not.toEqual(prevUpdatedAt);
    });

    it("should throw NotFoundError when maternal history not found", async () => {
      const fakeIdGenerator = () => "123";
      const maternalHistoryRepositoryPostgres =
        new MaternalHistoryRepositoryPostgres(pool, fakeIdGenerator);

      const payload = {
        lila: 10,
        hpht: "2021-08-01",
        htp: "2021-08-01",
        ancNumber: 1,
        husbandInitial: "husbandInitial",
        age: 20,
        parity: 1,
        pregnancyHistory: "pregnancyHistory",
        additionalNote: "additionalNote",
      };

      // Action & Assert
      await expect(
        maternalHistoryRepositoryPostgres.updateMaternalHistoryById(
          "maternal-history-123",
          payload
        )
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
