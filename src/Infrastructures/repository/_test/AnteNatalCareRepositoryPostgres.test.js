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
        jorongId: "jorong-123",
        midwifeId: "midwife-123",
        upperArmCircumference: 10,
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
      expect(anteNatalCare.contact_type).toStrictEqual("c1");
      expect(anteNatalCare.action).toStrictEqual("action");
      expect(anteNatalCare.tt_imunization).toStrictEqual("4");
      expect(anteNatalCare.height).toStrictEqual(160);
      expect(anteNatalCare.hemoglobin).toStrictEqual(12);
      expect(anteNatalCare.weight).toStrictEqual(50);
      expect(anteNatalCare.blood_pressure).toStrictEqual(120);
      expect(anteNatalCare.fundal_height).toStrictEqual(10);
      expect(anteNatalCare.fetal_heart_rate).toStrictEqual(120);
      expect(anteNatalCare.hbsag).toStrictEqual("negative");
      expect(anteNatalCare.hiv).toStrictEqual("negative");
      expect(anteNatalCare.syphilis).toStrictEqual("negative");
      expect(anteNatalCare.blood_type).toStrictEqual("A");
      expect(anteNatalCare.usg_check_date).toStrictEqual("2021-08-01");
      expect(anteNatalCare.jorong_id).toStrictEqual("jorong-123");
      expect(anteNatalCare.midwife_id).toStrictEqual("midwife-123");
      expect(anteNatalCare.upper_arm_circumference).toStrictEqual(10);
      expect(anteNatalCares).toHaveLength(1);
      expect(anteNatalCares).toBeDefined();
    });
  });

  describe("showAnteNatalCare function", () => {
    it("should return ante natal care data correctly", async () => {
      // Arrange
      const anteNatalCareRepositoryPostgres =
        new AnteNatalCareRepositoryPostgres(pool, {});

      // Action
      const anteNatalCares =
        await anteNatalCareRepositoryPostgres.showAnteNatalCares();

      // Assert
      expect(anteNatalCares.data).toHaveLength(0);
    });

    it("should filter data correctly", async () => {
      // Arrange
      const anteNatalCareRepositoryPostgres =
        new AnteNatalCareRepositoryPostgres(pool, {});

      await AnteNatalCareTableTestHelper.addAnteNatalCare({
        maternalHistoryId: "maternal-history-123",
        id: "ante-natal-care-123",
      });

      await AnteNatalCareTableTestHelper.addAnteNatalCare({
        maternalHistoryId: "maternal-history-123",
        id: "ante-natal-care-124",
      });

      await MaternalHistoryTableTestHelper.addMaternalHistory({
        id: "maternal-history-345",
        maternalId: "maternal-123",
      });

      await AnteNatalCareTableTestHelper.addAnteNatalCare({
        maternalHistoryId: "maternal-history-345",
        id: "ante-natal-care-345",
      });

      // Action
      const anteNatalCares =
        await anteNatalCareRepositoryPostgres.showAnteNatalCares({
          maternalHistoryId: "maternal-history-123",
        });

      // Assert
      expect(anteNatalCares.data).toHaveLength(2);
      expect(anteNatalCares.data[0]).toHaveProperty("id");
      expect(anteNatalCares.data[0]).toHaveProperty("contact_type");
      expect(anteNatalCares.data[0]).toHaveProperty("weight");
      expect(anteNatalCares.data[0]).toHaveProperty("height");
    });
  });
});
