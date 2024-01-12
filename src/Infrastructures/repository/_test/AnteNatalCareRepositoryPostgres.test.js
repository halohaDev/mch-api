const pool = require("../../database/postgres/pool");
const AnteNatalCareTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const AnteNatalCareRepositoryPostgres = require("../AnteNatalCareRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NagariTableTestHelper = require("../../../../tests/NagariTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const PlacementTableTestHelper = require("../../../../tests/PlacementsTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoryTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");

describe("AnteNatalCareRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AnteNatalCareTableTestHelper.cleanTable();
    await MaternalHistoryTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await NagariTableTestHelper.cleanTable();
    await PlacementTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "midwife-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await PlacementTableTestHelper.addPlacement({
      midwifeId: "midwife-123",
      jorongId: "jorong-123",
    });

    await UsersTableTestHelper.addUser({
      id: "user-123",
      email: "maternal@mail.com",
    });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123" });
    await MaternalHistoryTableTestHelper.addMaternalHistory({
      id: "maternal-history-123",
      maternalId: "maternal-123",
    });
  });

  describe("addAnteNatalCare function", () => {
    it("should persist add antenatalcare and return antenatalcare id correctly", async () => {
      // Arrange
      const payload = {
        maternalHistoryId: "maternal-history-123",
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        bloodPressure: 120,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: "A",
        usgCheckDate: "2021-08-01",
        placementId: "placement-123",
      };

      const fakeIdGenerator = () => "123";
      const anteNatalCareRepositoryPostgres =
        new AnteNatalCareRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const anteNatalCare =
        await anteNatalCareRepositoryPostgres.addAnteNatalCare(payload);

      // Assert
      const anteNatalCares =
        await AnteNatalCareTableTestHelper.findAnteNatalCareById("anc-123");

      expect(anteNatalCare.id).toStrictEqual("anc-123");
      expect(anteNatalCare.placement_id).toStrictEqual("placement-123");
      expect(anteNatalCare.contact_type).toStrictEqual("c1");
      expect(anteNatalCare.action).toStrictEqual("action");
      expect(anteNatalCare.tt_imunization).toStrictEqual("4");
      expect(anteNatalCare.height).toStrictEqual(160);
      expect(anteNatalCares).toBeDefined();
    });
  });
});
