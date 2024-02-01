const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CreateUser = require("../../../Domains/users/entities/CreateUser");
const CreatedUser = require("../../../Domains/users/entities/CreatedUser");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("UserRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableEmail function", () => {
    it("should throw InvariantError when email not available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        email: "user@mail.com",
        password: "password",
        name: "test",
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableEmail("user@mail.com")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when email available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableEmail("user@mail.com")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("verifyAvailableNik function", () => {
    it("should throw InvariantError when nik not available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ nik: "1234567890" });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableNik("1234567890")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when nik available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableNik("1234567890")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("verifyAvailablePhone function", () => {
    it("should throw InvariantError when phone not available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ phoneNumber: "081234567890" });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailablePhoneNumber("081234567890")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when phone available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailablePhoneNumber("081234567890")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("addUser function", () => {
    it("should persist new user", async () => {
      // Arrange
      const createUser = new CreateUser({
        email: "user@mail.com",
        password: "password",
        name: "user",
        role: "admin",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(createUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById("user-123");
      expect(users).toHaveLength(1);
    });

    it("should return created user correctly", async () => {
      // Arrange
      const createUser = new CreateUser({
        email: "user@mail.com",
        password: "password",
        name: "user",
        role: "admin",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdUser = await userRepositoryPostgres.addUser(createUser);

      // Assert
      expect(createdUser).toStrictEqual(
        new CreatedUser({
          id: "user-123",
          email: createUser.email,
          name: createUser.name,
        })
      );
    });
  });

  describe("getIdByEmail function", () => {
    it("should throw InvariantError when user not found", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.getIdByEmail("invalid@email.com")
      ).rejects.toThrowError("email yang anda masukkan tidak ditemukan");
    });

    it("should return id correctly", async () => {
      // Arrange
      const payload = { email: "user@mail.com", id: "user-123" };
      await UsersTableTestHelper.addUser(payload);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const id = await userRepositoryPostgres.getIdByEmail(payload.email);

      // Assert
      expect(id).toStrictEqual(payload.id);
    });
  });

  describe("getPasswordByEmail function", () => {
    it("should return password correctly", async () => {
      // Arrange
      const payload = { email: "user@mail.com", password: "password" };
      await UsersTableTestHelper.addUser(payload);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const password = await userRepositoryPostgres.getPasswordByEmail(
        payload.email
      );

      // Assert
      expect(password).toStrictEqual(payload.password);
    });

    it("should throw InvariantError when user not found", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.getPasswordByEmail("user-test@mail.com")
      ).rejects.toThrowError("email yang anda masukkan tidak ditemukan");
    });
  });

  describe("getUserById function", () => {
    it("should return user correctly", async () => {
      // Arrange
      const id = "user-123";
      await UsersTableTestHelper.addUser({ id });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const user = await userRepositoryPostgres.getUserById(id);

      // Assert
      expect(user).toBeDefined();
    });

    it("should throw NotFound error when user not found", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.getUserById("user-123")
      ).rejects.toThrowError("user tidak ditemukan");
    });
  });

  describe("getUsers function", () => {
    it("should return users correctly in pagination", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        email: "user123",
        nik: "1",
        phoneNumber: "1",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        email: "user456",
        nik: "2",
        phoneNumber: "2",
      });
      await UsersTableTestHelper.addUser({
        id: "user-789",
        email: "user789",
        nik: "3",
        phoneNumber: "3",
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const users = await userRepositoryPostgres.getUsers({
        perPage: 2,
        page: 1,
      });

      // Assert
      expect(users.data).toHaveLength(2);
    });

    it("should return users correctly in pagination with default value", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        email: "user123",
        nik: "1",
        phoneNumber: "1",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        email: "user456",
        nik: "2",
        phoneNumber: "2",
      });
      await UsersTableTestHelper.addUser({
        id: "user-789",
        email: "user789",
        nik: "3",
        phoneNumber: "3",
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const users = await userRepositoryPostgres.getUsers({});

      // Assert
      expect(users.data).toHaveLength(3);
    });
  });
});
