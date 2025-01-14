const MaternalRepositoryPostgres = require("../MaternalRepositoryPostgres");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AddMaternal = require("../../../Domains/maternal/entities/NewMaternal");
const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const { snakeToCamelObject } = require("../../../Commons/helper");

describe("MaternalRepositoryPostgres", () => {
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

  describe("addMaternal function", () => {
    it("should persist add maternal and return maternal id correctly", async () => {
      // Arrange
      const addMaternal = new AddMaternal({
        userId: "user-123",
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: "1",
        maritalStatus: "single",
        jorongId: "jorong-123",
      });

      const fakeIdGenerator = () => "123";
      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const maternalId = await maternalRepositoryPostgres.addMaternal(
        addMaternal
      );

      // Assert
      const maternals = await MaternalTableTestHelper.findMaternalById(
        "maternal-123"
      );

      expect(maternalId).toStrictEqual("maternal-123");
      expect(maternals).toBeDefined();
    });
  });

  describe("findMaternalByUserId function", () => {
    it("should return maternal correctly", async () => {
      // Arrange
      const userId = "user-123";

      await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId });

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const maternal = await maternalRepositoryPostgres.findMaternalByUserId(
        userId
      );

      // Assert
      const {
        id,
        maternal_date: maternalDate,
        marital_date: maritalDate,
        number_of_marriage: numberOfMarriage,
        marital_status: maritalStatus,
      } = maternal;

      expect(id).toStrictEqual("maternal-123");
      expect(new Date(maternalDate)).toBeInstanceOf(Date);
      expect(new Date(maritalDate)).toBeInstanceOf(Date);
      expect(numberOfMarriage).toStrictEqual("1");
      expect(maritalStatus).toStrictEqual("single");
    });

    it("shoudl throw NotFoundError when maternal not found", async () => {
      // Arrange
      const userId = "user-123";

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        maternalRepositoryPostgres.findMaternalByUserId(userId)
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("updateMaternalByUserId function", () => {
    it("should update maternal correctly", async () => {
      // Arrange
      const userId = "user-123";

      await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId });

      const fakeIdGenerator = () => "123";
      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const updateMaternal = {
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: "1",
        maritalStatus: "single",
      };

      // Action
      await maternalRepositoryPostgres.updateMaternalByUserId(
        userId,
        updateMaternal
      );

      // Assert
      const maternal = await MaternalTableTestHelper.findMaternalById(
        "maternal-123"
      );
      expect(maternal).toBeDefined();
    });
  });

  describe("showAllMaternal function", () => {
    it("should return all maternal correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await UsersTableTestHelper.addUser({ id: "user-456" });
      await MaternalTableTestHelper.addMaternal({
        id: "maternal-123",
        userId: "user-123",
      });
      await MaternalTableTestHelper.addMaternal({
        id: "maternal-456",
        userId: "user-456",
      });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-123",
        maternalId: "maternal-123",
      });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-124",
        maternalId: "maternal-456",
      });

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const { data: maternals } =
        await maternalRepositoryPostgres.showAllMaternal();

      // Assert
      expect(maternals).toHaveLength(2);
      expect(maternals[0].id).toStrictEqual("maternal-123");
      expect(maternals[1].id).toStrictEqual("maternal-456");
    });

    it("should return with last maternal history status", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await MaternalTableTestHelper.addMaternal({
        id: "maternal-123",
        userId: "user-123",
      });

      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-123",
        maternalId: "maternal-123",
      });

      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        id: "maternal-history-124",
        maternalId: "maternal-123",
      });

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const { data: maternals } =
        await maternalRepositoryPostgres.showAllMaternal();

      // Assert
      expect(maternals).toHaveLength(1);
      expect(maternals[0].id).toStrictEqual("maternal-123");
      expect(maternals[0]).toHaveProperty("last_maternal_status");
      expect(maternals[0]).toHaveProperty("last_maternal_history_id");
    });

    it("should return empty array when no maternal found", async () => {
      // Arrange
      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const { data: maternals } =
        await maternalRepositoryPostgres.showAllMaternal();

      // Assert
      expect(maternals).toHaveLength(0);
    });
  });

  describe("findMaternalById function", () => {
    it("should return maternal correctly", async () => {
      // Arrange
      await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {},
        snakeToCamelObject
      );

      // Action
      const maternal = await maternalRepositoryPostgres.findMaternalById(
        "maternal-123"
      );

      // Assert
      expect(maternal).toBeDefined();
    });

    it("should throw NotFoundError when maternal not found", async () => {
      // Arrange
      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(
        pool,
        {},
        snakeToCamelObject
      );

      // Action & Assert
      await expect(
        maternalRepositoryPostgres.findMaternalById("maternal-123")
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
