const pool = require("../../database/postgres/pool");
const PlacementsTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const PlacementQuery = require("../PlacementQuery");

describe("Placement Query Implementation", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await PlacementsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "midwife-123", role: "midwife" });
    await UsersTableTestHelper.addUser({ id: "midwife-124", role: "midwife" });
    await UsersTableTestHelper.addUser({ id: "midwife-125", role: "midwife" });

    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-124" });

    await PlacementsTableTestHelper.addPlacement({
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
    });

    await PlacementsTableTestHelper.addPlacement({
      midwifeId: "midwife-124",
      jorongId: "jorong-123",
    });

    await PlacementsTableTestHelper.addPlacement({
      midwifeId: "midwife-125",
      jorongId: "jorong-124",
    });
  });

  describe("when call with wheres", () => {
    it("should return according to midwifeId", async () => {
      const placementQuery = new PlacementQuery({ pool });
      const result = await placementQuery.wheres({ midwifeId: "midwife-123" }).paginate();

      expect(result.data).toHaveLength(1);
    });

    it("should return according to jorongId", async () => {
      const placementQuery = new PlacementQuery({ pool });
      const result = await placementQuery.wheres({ jorongId: "jorong-123" }).paginate();

      expect(result.data).toHaveLength(2);
    });

    it("should return all placements", async () => {
      const placementQuery = new PlacementQuery({ pool });
      const result = await placementQuery.paginate();

      expect(result.data).toHaveLength(3);
    });
  });
});
