const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const AnteNatalTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const MaternalQuery = require("../MaternalQuery");

describe("MaternalQuery", () => {
  afterEach(async () => {
    await AnteNatalTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("joinByLastMaternalStatus", () => {
    it("should return maternal data correctly", async () => {
      // Arrange
      const userId = "user-123";
      const maternalId = "maternal-123";
      const maternalQuery = new MaternalQuery({ pool });

      await UsersTableTestHelper.addUser({ id: userId });
      await MaternalTableTestHelper.addMaternal({ id: maternalId, userId });
      await MaternalHistoriesTableTestHelper.addMaternalHistory({
        maternalId,
        maternalStatus: "pregnant",
      });

      const queryParams = ["lastMaternalStatus"];

      const columns = [
        "maternals.id",
        "maternals.user_id",
        "maternal_histories.maternal_status as last_maternal_status",
      ];

      // Action
      const queryResult = await maternalQuery
        .selects(columns)
        .joins(queryParams)
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(1);
      expect(queryResult.data[0]).toHaveProperty("last_maternal_status");
    });
  });

  describe("joinByUsers", () => {
    it("should return maternal data correctly", async () => {
      // Arrange
      const userId = "user-123";
      const maternalId = "maternal-123";
      const maternalQuery = new MaternalQuery({ pool });

      await UsersTableTestHelper.addUser({ id: userId });
      await MaternalTableTestHelper.addMaternal({ id: maternalId, userId });

      const queryParams = ["users"];

      const columns = ["maternals.id", "users.name"];

      // Action
      const queryResult = await maternalQuery
        .selects(columns)
        .joins(queryParams)
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(1);
      expect(queryResult.data[0]).toHaveProperty("name");
    });
  });


  describe.skip("getBySearch", () => {
    it("should return maternal data correctly", async () => {
      // Arrange
      const userId = "user-123";
      const maternalId = "maternal-123";
      const maternalQuery = new MaternalQuery({ pool });

      await UsersTableTestHelper.addUser({ id: userId, name: "user" });
      await MaternalTableTestHelper.addMaternal({ id: maternalId, userId });

      const queryParams = {
        search: "user",
      };

      // Action
      const queryResult = await maternalQuery
        .joins(["users"])
        .selects(["maternals.id", "users.name"])
        .wheres(queryParams)
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(1);
    });

    it("should return empty array when maternal not found", async () => {
      // Arrange
      const maternalQuery = new MaternalQuery({ pool });

      const queryParams = {
        search: "test",
      };

      // Action
      const queryResult = await maternalQuery
        .joins(["users"])
        .selects(["maternals.id", "users.name"])
        .wheres(queryParams)
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(0);
    });
  });

  describe("joinByJorong", () => {
    it("should return maternal data correctly", async () => {
      // Arrange
      const userId = "user-123";
      const maternalId = "maternal-123";
      const maternalQuery = new MaternalQuery({ pool });

      await UsersTableTestHelper.addUser({ id: userId });
      await MaternalTableTestHelper.addMaternal({ id: maternalId, userId, jorongId: "jorong-123" });

      const queryParams = ["jorong"];
      const columns = ["maternals.id", "jorong.name as jorong_name"];

      // Action
      const queryResult = await maternalQuery
        .selects(columns)
        .joins(queryParams)
        .paginate();
      
      // Assert
      expect(queryResult.data).toHaveLength(1);
      expect(queryResult.data[0]).toHaveProperty("jorong_name");
    });
  });

  it("should return maternal data correctly when combined with other query", async () => {
    // Arrange
    const userId = "user-123";
    const maternalId = "maternal-123";
    const maternalQuery = new MaternalQuery({ pool });

    await UsersTableTestHelper.addUser({ id: userId, name: "user" });
    await MaternalTableTestHelper.addMaternal({ id: maternalId, userId });

    // Action
    const queryResult = await maternalQuery
      .joins(["users", "jorong"])
      .selects([
        "maternals.id",
        "users.name",
        "jorong.name as jorong_name",
      ])
      .paginate();

    // Assert
    expect(queryResult.data).toHaveLength(1);
    expect(queryResult.data[0]).toHaveProperty("name");
    expect(queryResult.data[0]).toHaveProperty("jorong_name");
  });
});
