const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - users", () => {
  let token;

  beforeEach(async () => {
    token = await authenticateUser("user-123", "admin");
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it("should response 201 and persisted user", async () => {
    // Arrange
    const payload = {
      email: "user-test@mail.com",
      password: "password",
      name: "user test",
      role: "midwife",
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual("success");
    expect(responseJson.data.createdUser).toBeDefined();
  });

  it("should response 422 when request payload not contain needed property", async () => {
    // Arrange
    const payload = {
      email: "test@mail.com",
      password: "password",
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(422);
    expect(responseJson.status).toEqual("fail");
    expect(responseJson.message).toEqual("Unprocessable Entity");
  });

  // create test for not meet data specification error
  it("should response 422 when request payload not meet data specification", async () => {
    // Arrange
    const payload = {
      email: "user-test@mail.com",
      password: 123,
      name: "user test",
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(422);
    expect(responseJson.status).toEqual("fail");
    expect(responseJson.message).toEqual("Unprocessable Entity");
  });

  // create test for email not in email format return error
  it("should response 422 when email is not email format", async () => {
    // Arrange
    const payload = {
      email: "user-test",
      password: "password",
      name: "user test",
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(422);
    expect(responseJson.status).toEqual("fail");
    expect(responseJson.message).toEqual("Unprocessable Entity");
  });

  // test for email already registered
  it("should response 422 when email already registered", async () => {
    // Arrange
    const payload = {
      email: "user-test@mail.com",
      password: "password",
      name: "user test",
      role: "midwife",
    };

    await UsersTableTestHelper.addUser({ email: payload.email });

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual("fail");
    expect(responseJson.message).toEqual(
      "tidak dapat membuat user baru karena email sudah digunakan"
    );
  });

  it("should response 401 when request not contain access token", async () => {
    // Arrange
    const payload = {
      email: "user-test@mail.com",
      password: "password",
      name: "user test",
      role: "midwife",
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(401);
    expect(responseJson.status).toEqual("fail");
  });

  it("should response 403 when request contain access token but not have admin role", async () => {
    // Arrange
    const payload = {
      email: "user-test@mail.com",
      password: "password",
      name: "user test",
      role: "midwife",
    };

    const server = await createServer(container);
    token = await authenticateUser("user-123", "midwife");

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/users",
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(403);
    expect(responseJson.status).toEqual("fail");
  });

  describe("when create user mother", () => {
    it("should response 422 when request payload not contain needed property", async () => {
      // Arrange
      const payload = {
        email: "user-test@mail.com",
        password: "secret",
        name: "user test",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "user test address",
        dateOfBirth: "1999-12-12",
        birthplace: "user test birthplace",
        jobTitle: "user test job title",
        religion: "user test religion",
        role: "mother",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Unprocessable Entity");
    });

    // create test for not meet data specification error
    it("should response 422 when request payload not meet data specification", async () => {
      // Arrange
      const payload = {
        email: "user-test@mail.com",
        password: "secret",
        name: "user test",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "user test address",
        dateOfBirth: "1999-12-12",
        birthplace: "user test birthplace",
        jobTitle: "user test job title",
        religion: "user test religion",
        isActiveBpjs: true,
        role: "mother",
        bpjsKesehatanNumber: 1234567890123456,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(422);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Unprocessable Entity");
    });

    // create test for nik not in nik format return error
    it.skip("should response 422 when nik is not nik format", async () => {
      // Arrange
      const payload = {
        email: "user-test@mail.com",
        password: "secret",
        name: "user test",
        nik: "aaaaa",
        phoneNumber: "081234567890",
        address: "user test address",
        dateOfBirth: "1999-12-12",
        birthplace: "user test birthplace",
        jobTitle: "user test job title",
        religion: "user test religion",
        isActiveBpjs: true,
        role: "mother",
        bpjsKesehatanNumber: "1234567890123456",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat user baru karena NIK tidak valid"
      );
    });

    // create test for nik availability
    it("should response 400 when nik already registered", async () => {
      const payload = {
        email: "user-test@mail.com",
        password: "secret",
        name: "user test",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "user test address",
        dateOfBirth: "1999-12-12",
        birthplace: "user test birthplace",
        jobTitle: "user test job title",
        religion: "user test religion",
        isActiveBpjs: true,
        role: "mother",
        bpjsKesehatanNumber: "1234567890123456",
      };
      await UsersTableTestHelper.addUser({ nik: payload.nik });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("NIK sudah digunakan");
    });

    // create test for phone availabitity
    it("should response 422 when phone number already registered", async () => {
      const payload = {
        email: "user-test@mail.com",
        password: "secret",
        name: "user test",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "user test address",
        dateOfBirth: "1999-12-12",
        birthplace: "user test birthplace",
        jobTitle: "user test job title",
        religion: "user test religion",
        isActiveBpjs: true,
        role: "mother",
        bpjsKesehatanNumber: "1234567890123456",
      };

      await UsersTableTestHelper.addUser({ phoneNumber: payload.phoneNumber });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/v1/users",
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Nomor telepon sudah digunakan");
    });
  });

  describe("when to show all users", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.createManyUser(10);
    });

    it("should response 200 and show all users", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/users",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.length).toEqual(10);
    });

    it("should return 200 and show users with limit", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/users?perPage=3",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeDefined();
      expect(responseJson.meta.perPage).toEqual(3);
      expect(responseJson.meta.size).toEqual(10);
      // TODO: fix this flaky test
      // expect(responseJson.meta.totalPages).toEqual(4);
    });

    it("should return 200 and show users with page", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/users?page=4&perPage=3",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.length).toEqual(1);
      expect(responseJson.meta.currentPage).toEqual(4);
      expect(responseJson.meta.perPage).toEqual(3);
      expect(responseJson.meta.size).toEqual(10);
      expect(responseJson.meta.totalPages).toEqual(4);
    });
  });

  describe("wehen update user", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123", email: "a@email.com" });
    });

    it("should response 200 and updated user", async () => {
      // Arrange
      const payload = {
        email: "test_email.com"
      }

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/api/v1/users/user-123",
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.email).toEqual(payload.email);

      const updatedUser = await UsersTableTestHelper.findUserById("user-123");
      expect(updatedUser[0].email).toEqual(payload.email);
    });
  });
});
