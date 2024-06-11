const PlacementRepositoryPostgres = require("../PlacementRepositoryPostgres");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const NagariTableTestHelper = require("../../../../tests/NagariTableTestHelper");
const PlacementTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const { snakeToCamelObject } = require("../../../Commons/helper");
const ShowedPlacement = require("../../../Domains/placements/entities/ShowedPlacement");

describe("PlacementRepository postgres implementation", () => {
  afterEach(async () => {
    await PlacementTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await NagariTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UserTableTestHelper.addUser({ id: "midwife-123" });
    await NagariTableTestHelper.addNagari({ id: "nagari-123", name: "Nagari Test" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123", nagariId: "nagari-123", name: "Jorong Test" });
  });

  describe("addPlacement function", () => {
    it("should persist placement and return id", async () => {
      // Arrange
      const placementRepositoryPostgres = new PlacementRepositoryPostgres(
        pool,
        {}
      );

      // Action
      await placementRepositoryPostgres.addPlacement({
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        placementDate: "2021-01-01T00:00:00.000Z",
      });

      // Assert
      const placement = await PlacementTableTestHelper.findPlacementByIds(
        "midwife-123",
        "jorong-123"
      );
      expect(placement).toBeDefined();
      expect(placement.midwife_id).toBe("midwife-123");
      expect(placement.jorong_id).toBe("jorong-123");
    });
  });

  describe("findPlacementByIds function", () => {
    it("should throw NotFoundError when placement not found", async () => {
      // Arrange
      const placementRepositoryPostgres = new PlacementRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        placementRepositoryPostgres.findPlacementByIds(
          "midwife-123",
          "jorong-123"
        )
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return placement when placement is found", async () => {
      // Arrange
      await PlacementTableTestHelper.addPlacement({
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        placementDate: "2021-01-01T00:00:00.000Z",
      });
      const placementRepositoryPostgres = new PlacementRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const placement = await placementRepositoryPostgres.findPlacementByIds(
        "midwife-123",
        "jorong-123"
      );

      // Assert
      expect(placement).toStrictEqual({
        midwife_id: "midwife-123",
        jorong_id: "jorong-123",
      });
    });
  });

  describe("getPlacementByMidwifeId function", () => {
    it("should return placements", async () => {
      // Arrange
      const date = new Date();

      await PlacementTableTestHelper.addPlacement({
        midwifeId: "midwife-123",
        jorongId: "jorong-123",
        placementDate: date,
      });

      const placementRepositoryPostgres = new PlacementRepositoryPostgres(
        pool,
        snakeToCamelObject
      );

      const expectedPlacements = [
        new ShowedPlacement({
          midwifeId: "midwife-123",
          jorongId: "jorong-123",
          jorongName: "Jorong Test",
          placementDate: date,
          nagariName: "Nagari Test",
        }),
      ];

      // Action
      const placements =
        await placementRepositoryPostgres.getPlacementByMidwifeId(
          "midwife-123"
        );

      // Assert
      expect(placements).toStrictEqual(expectedPlacements);
    });

    it("should return empty array when placements not found", async () => {
      // Arrange
      const placementRepositoryPostgres = new PlacementRepositoryPostgres(
        pool,
        snakeToCamelObject
      );

      // Action
      const placements =
        await placementRepositoryPostgres.getPlacementByMidwifeId(
          "midwife-123"
        );

      // Assert
      expect(placements).toStrictEqual([]);
    });
  });
});
