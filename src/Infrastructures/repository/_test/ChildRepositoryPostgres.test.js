const ChildRepositoryPostgres = require("../ChildRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const ChildrenTableTestHelper = require("../../../../tests/ChildrenTableTestHelper");

describe("ChildRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ChildrenTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });
    await MaternalHistoryTableTestHelper.addMaternalHistory({ id: "maternal-history-123" });
  });

  describe("addChild function", () => {
    it("should persist add childs and return child id correctly", async () => {
      // Arrange
      const payload = {
        name: "test",
        nik: "123",
        birthDatetime: "2021-08-22",
        birthWeight: "3",
        birthHeight: "50",
        gender: "L",
        fatherName: "test",
        pregnancyAge: "9",
        deliveryPlace: "PUSKESMAS",
        deliveryMethod: "NORMAL",
        helper: "DUKUN",
        maternalId: "maternal-123",
        maternalHistoryId: "maternal-history-123",
      };

      const fakeIdGenerator = () => "123";
      const childRepositoryPostgres = new ChildRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const childId = await childRepositoryPostgres.addChild(payload);

      // Assert
      const child = await ChildrenTableTestHelper.findChildById(childId);
      expect(child).toBeDefined();
      expect(child.id).toEqual("child-123");
      expect(child.name).toEqual("test");
      expect(child.nik).toEqual("123");
      expect(child.birth_datetime).toBeDefined();
      expect(child.birth_weight).toEqual(3);
      expect(child.birth_height).toEqual(50);
    });
  });
});
