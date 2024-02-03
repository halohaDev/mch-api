const pool = require("../../database/postgres/pool");
const AnteNatalCareQuery = require("../AnteNatalCareQuery");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const MaternalHistoriesTableTestHelper = require("../../../../tests/MaternalHistoriesTableTestHelper");
const AnteNatalCaresTableTestHelper = require("../../../../tests/AnteNatalCaresTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");

describe("Ante Natal Query", () => {
  afterEach(async () => {
    await AnteNatalCaresTableTestHelper.cleanTable();
    await MaternalHistoriesTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-345" });
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await MaternalTableTestHelper.addMaternal({
      id: "maternal-123",
      userId: "user-123",
    });

    // Arrange
    await MaternalHistoriesTableTestHelper.addMaternalHistory({
      maternalId: "maternal-123",
      id: "maternal-history-123",
    });
    await MaternalHistoriesTableTestHelper.addMaternalHistory({
      maternalId: "maternal-123",
      id: "maternal-history-345",
    });

    // history 123
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({
      maternalHistoryId: "maternal-history-123",
      id: "ante-natal-care-123",
      dateOfVisit: "2022-08-01",
    });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({
      maternalHistoryId: "maternal-history-123",
      id: "ante-natal-care-124",
      jorongId: "jorong-345",
    });

    // history 345
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({
      maternalHistoryId: "maternal-history-345",
      id: "ante-natal-care-345",
      dateOfVisit: "2022-08-04",
    });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({
      maternalHistoryId: "maternal-history-345",
      id: "ante-natal-care-346",
    });
    await AnteNatalCaresTableTestHelper.addAnteNatalCare({
      maternalHistoryId: "maternal-history-345",
      id: "ante-natal-care-347",
      jorongId: "jorong-345",
    });
  });

  describe("getByMaternalHistoryId", () => {
    it("should return ante natal care data correctly", async () => {
      // Arrange
      const anteNatalCareQuery = new AnteNatalCareQuery({ pool });

      // Action
      const queryResult = await anteNatalCareQuery
        .wheres({ maternalHistoryId: "maternal-history-345" })
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(3);
      expect(queryResult.data[0]).toHaveProperty("id");
      expect(queryResult.data[0]).toHaveProperty("contact_type");
      expect(queryResult.data[0]).toHaveProperty("weight");
      expect(queryResult.data[0]).toHaveProperty("height");
      expect(queryResult.data[0]).toHaveProperty("hemoglobin");
      expect(queryResult.data[0]).toHaveProperty("blood_pressure");
      expect(queryResult.data[0]).toHaveProperty("fundal_height");
      expect(queryResult.data[0]).toHaveProperty("fetal_heart_rate");
      expect(queryResult.data[0]).toHaveProperty("usg_check_date");
      expect(queryResult.data[0]).toHaveProperty("temprature");
      expect(queryResult.data[0]).toHaveProperty("action");
      expect(queryResult.data[0]).toHaveProperty("blood_type");
      expect(queryResult.data[0]).toHaveProperty("tt_imunization");
      expect(queryResult.data[0]).toHaveProperty("protein_in_urine");
      expect(queryResult.data[0]).toHaveProperty("blood_sugar");
      expect(queryResult.data[0]).toHaveProperty("hbsag");
      expect(queryResult.data[0]).toHaveProperty("hiv");
      expect(queryResult.data[0]).toHaveProperty("syphilis");
      expect(queryResult.data[0]).toHaveProperty("maternal_history_id");
      expect(queryResult.data[0]).toHaveProperty("date_of_visit");
      expect(queryResult.data[0]).toHaveProperty("art_given");
      expect(queryResult.data[0]).toHaveProperty("upper_arm_circumference");
      expect(queryResult.data[0]).toHaveProperty("jorong_id");
      expect(queryResult.data[0]).toHaveProperty("midwife_id");
    });

    it("should return according to jorong id", async () => {
      // Arrange
      const anteNatalCareQuery = new AnteNatalCareQuery({ pool });

      // Action
      const queryResult = await anteNatalCareQuery
        .wheres({ jorongId: "jorong-345" })
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(2);
    });

    it("should return according to date of visit", async () => {
      // Arrange
      const anteNatalCareQuery = new AnteNatalCareQuery({ pool });

      // Action
      const queryResult = await anteNatalCareQuery
        .wheres({
          dateOfVisitBiggerThan: "2022-08-01",
          dateOfVisitSmallerThan: "2022-08-05",
        })
        .paginate();

      // Assert
      expect(queryResult.data).toHaveLength(2);
    });
  });
});
