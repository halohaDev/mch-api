const ChildCareRepositoryPostgres = require("../ChildCareRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const ChildrenTableTestHelper = require("../../../../tests/ChildrenTableTestHelper");
const ChildCaresTableTestHelper = require("../../../../tests/ChildCaresTableTestHelper");
const { snakeToCamelObject } = require("../../../Commons/helper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ChildCareRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ChildCaresTableTestHelper.cleanTable();
    await ChildrenTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "midwife-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-124" });
    await MaternalHistoryTableTestHelper.addMaternalHistory({ id: "maternal-history-123" });
    await ChildrenTableTestHelper.addChild({ id: "child-123" });
  });

  describe("addChildCare function", () => {
    it("should persist add child cares and return child care id correctly", async () => {
      // Arrange
      const payload = {
        childId: "child-123",
        jorongId: "jorong-123",
        midwifeId: "midwife-123",
        weight: 3,
        height: 50,
        headCircumference: 30,
        notes: "test",
        dateOfVisit: "2021-08-22",
      };

      const fakeIdGenerator = () => "123";
      const childCareRepositoryPostgres = new ChildCareRepositoryPostgres(pool, fakeIdGenerator, snakeToCamelObject);

      // Action
      const { id: childCareId } = await childCareRepositoryPostgres.addChildCare(payload);

      // Assert
      const childCare = await ChildCaresTableTestHelper.findChildCareById(childCareId);

      expect(childCare.id).toBe(childCareId);
      expect(childCare.childId).toBe(payload.childId);
      expect(childCare.jorongId).toBe(payload.jorongId);
      expect(childCare.midwifeId).toBe(payload.midwifeId);
      expect(childCare.weight).toBe(payload.weight);
      expect(childCare.height).toBe(payload.height);
      expect(childCare.headCircumference).toBe(payload.headCircumference);
      expect(childCare.notes).toBe(payload.notes);
      expect(childCare.dateOfVisit).toBeDefined();
    });
  });

  describe("updateChildCare function", () => {
    it("should persist update child cares and return child care id correctly", async () => {
      // Arrange
      await ChildCaresTableTestHelper.addChildCare({ id: "child-care-123", childId: "child-123", weight: 2 });

      const payload = {
        id: "child-care-123",
        childId: "child-123",
        jorongId: "jorong-123",
        midwifeId: "midwife-123",
        weight: 3,
        height: 50,
        headCircumference: 30,
        notes: "test",
        dateOfVisit: "2021-08-22",
      };

      const fakeIdGenerator = () => "123";
      const childCareRepositoryPostgres = new ChildCareRepositoryPostgres(pool, fakeIdGenerator, snakeToCamelObject);

      // Action
      const { id: childCareId } = await childCareRepositoryPostgres.updateChildCare(payload.id, payload);

      // Assert
      const childCare = await ChildCaresTableTestHelper.findChildCareById(childCareId);

      expect(childCare.id).toBe(payload.id);
      expect(childCare.childId).toBe(payload.childId);
      expect(childCare.jorongId).toBe(payload.jorongId);
      expect(childCare.midwifeId).toBe(payload.midwifeId);
      expect(childCare.weight).toBe(payload.weight);
      expect(childCare.height).toBe(payload.height);
      expect(childCare.headCircumference).toBe(payload.headCircumference);
      expect(childCare.notes).toBe(payload.notes);
      expect(childCare.dateOfVisit).toBeDefined();
    });
  });

  describe("deleteChildCareById function", () => {
    it("should persist delete child cares and return child care id correctly", async () => {
      // Arrange
      await ChildCaresTableTestHelper.addChildCare({ id: "child-care-123", childId: "child-123" });

      const fakeIdGenerator = () => "123";
      const childCareRepositoryPostgres = new ChildCareRepositoryPostgres(pool, fakeIdGenerator, snakeToCamelObject);

      // Action
      const { id: childCareId } = await childCareRepositoryPostgres.deleteChildCareById("child-care-123");

      // Assert
      const childCare = await ChildCaresTableTestHelper.findChildCareById(childCareId);

      expect(childCare).toBeUndefined();
    });
  });

  describe("showChildCares function", () => {
    it("should return object of child cares correctly", async () => {
      // Arrange
      await ChildCaresTableTestHelper.addChildCare({ id: "child-care-123", childId: "child-123" });

      const fakeIdGenerator = () => "123";
      const childCareRepositoryPostgres = new ChildCareRepositoryPostgres(pool, fakeIdGenerator, snakeToCamelObject);

      // Action
      const childCares = await childCareRepositoryPostgres.showChildCares({ childId: "child-123" });

      // Assert
      expect(childCares.data).toHaveLength(1);
      expect(childCares.data[0].childId).toBe("child-123");
    });
  });

  describe("findChildCareById function", () => {
    it("should return object of child care correctly", async () => {
      // Arrange
      await ChildCaresTableTestHelper.addChildCare({ id: "child-care-123", childId: "child-123" });

      const fakeIdGenerator = () => "123";
      const childCareRepositoryPostgres = new ChildCareRepositoryPostgres(pool, fakeIdGenerator, snakeToCamelObject);

      // Action
      const childCare = await childCareRepositoryPostgres.findChildCareById("child-care-123");

      // Assert
      expect(childCare.id).toBe("child-care-123");
      expect(childCare.childId).toBe("child-123");
    });

    it("should return not found when not found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";

      const childCareRepositoryPostgres = new ChildCareRepositoryPostgres(pool, fakeIdGenerator, snakeToCamelObject);

      // Action & Assert
      await expect(childCareRepositoryPostgres.findChildCareById("child-care-123")).rejects.toThrowError(NotFoundError);
    });
  });
});
