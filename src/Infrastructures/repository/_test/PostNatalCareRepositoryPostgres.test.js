const pool = require("../../database/postgres/pool");
const PostNatalCareRepositoryPostgres = require("../PostNatalCareRepositoryPostgres");
const PostNatalCareTableTestHelper = require("../../../../tests/PostNatalCareTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NagariTableTestHelper = require("../../../../tests/NagariTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const PlacementTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const { snakeToCamelObject } = require("../../../Commons/helper");

describe("PostNatalCareRepositoryPostgres", () => {
  afterEach(async () => {
    await PostNatalCareTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await NagariTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await PlacementTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addPostNatalCare function", () => {
    it("should persist post natal care and return post natal care correctly", async () => {
      // Arrange
      const idGenerator = () => "123"; // stub!
      const postNatalCareRepositoryPostgres = new PostNatalCareRepositoryPostgres(pool, idGenerator, snakeToCamelObject);
      
      await UsersTableTestHelper.addUser({ id: "user-123", role: "midwife" });
      await NagariTableTestHelper.addNagari({ id: "nagari-123" });
      await JorongTableTestHelper.addJorong({ id: "jorong-123", nagariId: "nagari-123" });
      await UsersTableTestHelper.addUser({ id: "user-124", role: "mother" });
      await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId: "user-124" });
      await MaternalHistoryTableTestHelper.addMaternalHistory({ id: "maternal-history-123", maternalId: "maternal-123" });
      
      const payload = {
        maternalHistoryId: "maternal-history-123",
        jorongId: "jorong-123",
        midwifeId: "user-123",
        bloodPressure: 120,
        temperature: 36,
        vitA: false,
        fe: false,
        postNatalType: "pnc_1",
      };
      
      // Action
      const postNatalCare = await postNatalCareRepositoryPostgres.addPostNatalCare(payload);

      // Assert
      expect(postNatalCare.id).toEqual("pnc-123");
      expect(postNatalCare.maternalHistoryId).toEqual("maternal-history-123");
      expect(postNatalCare.jorongId).toEqual("jorong-123");
      expect(postNatalCare.midwifeId).toEqual("user-123");
      expect(postNatalCare.bloodPressure).toEqual(120);
      expect(postNatalCare.temperature).toEqual(36);
      expect(postNatalCare.vitA).toEqual(false);
      expect(postNatalCare.fe).toEqual(false);
      expect(postNatalCare.postNatalType).toEqual("pnc_1");
    });
  });
});