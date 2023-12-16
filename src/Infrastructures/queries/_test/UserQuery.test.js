const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("UserQuery", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe("when call with wheres", () => {
    it("should return user correctly", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      await UsersTableTestHelper.addUser({ id: "user-123" });

      // Action
      const users = await userQuery.wheres({ id: "user-123" }).paginate();

      // Assert
      expect(users).toHaveLength(1);
    });

    it("should return empty array when user not found", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      // Action
      const users = await userQuery.wheres({ id: "user-123" }).paginate();

      // Assert
      expect(users).toHaveLength(0);
    });

    it("should return with pagination format", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      await UsersTableTestHelper.addUser({ id: "user-123" });

      // Action
      const users = await userQuery.wheres({ id: "user-123" }).paginate();

      // Assert
      expect(users).toHaveProperty("data");
      expect(users).toHaveProperty("meta");
      expect(users.meta).toHaveProperty("currentPage");
      expect(users.meta).toHaveProperty("perPage");
      expect(users.meta).toHaveProperty("totalPages");
      expect(users.meta).toHaveProperty("totalData");
    });

    it("should return user correctly when search by name", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      await UsersTableTestHelper.addUser({ id: "user-123", name: "user test" });

      // Action
      const users = await userQuery.wheres({ name: "user test" }).paginate();

      // Assert
      expect(users).toHaveLength(1);
    });

    it("should return user correctly when search by email", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      await UsersTableTestHelper.addUser({
        id: "user-123",
        email: "test@mail.com",
      });

      // Action
      const users = await userQuery
        .wheres({ email: "test@mail.com" })
        .paginate();

      // Assert
      expect(users).toHaveLength(1);
    });

    it("should return user correctly when search by role", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      await UsersTableTestHelper.addUser({ id: "user-123", role: "midwife" });

      // Action
      const users = await userQuery.wheres({ role: "midwife" }).paginate();

      // Assert
      expect(users).toHaveLength(1);
    });

    it("should return user correctly when search by name and role", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      await UsersTableTestHelper.addUser({
        id: "user-123",
        name: "user test",
        role: "midwife",
      });

      // Action
      const users = await userQuery
        .wheres({ name: "user test", role: "midwife" })
        .paginate();

      // Assert
      expect(users).toHaveLength(1);
    });

    it("should return pagination meta correctly when search", async () => {
      // Arrange
      const userQuery = new UserQuery({ pool });

      // each 150 users
      for (let i = 0; i < 150; i++) {
        await UsersTableTestHelper.addUser({
          id: `user-${i}`,
          nik: `1234567890${i}`,
          email: `email${i}@mail.com`,
          role: "midwife",
        });
      }

      // Action
      const users = await userQuery.wheres({ role: "midwife" }).paginate();

      // Assert
      expect(users.meta.currentPage).toEqual(1);
      expect(users.meta.perPage).toEqual(10);
      expect(users.meta.totalPages).toEqual(15);
      expect(users.meta.totalData).toEqual(150);
    });
  });
});
