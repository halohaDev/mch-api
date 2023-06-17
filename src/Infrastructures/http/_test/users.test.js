const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server - users', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 201 and persisted user', async () => {
    // Arrange
    const payload = {
      email: 'user-test@mail.com',
      password: 'password',
      name: 'user test',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.createdUser).toBeDefined();
  });

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    const payload = {
      email: 'test@mail.com',
      password: 'password',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
  });

  // create test for not meet data specification error
  it('should response 400 when request payload not meet data specification', async () => {
    // Arrange
    const payload = {
      email: 'user-test@mail.com',
      password: 123,
      name: 'user test',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
  });

  // create test for email not in email format return error
  it('should response 400 when email is not email format', async () => {
    // Arrange
    const payload = {
      email: 'user-test',
      password: 'password',
      name: 'user test',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat user baru karena email tidak valid');
  });

  // test for email already registered
  it('should response 400 when email already registered', async () => {
    // Arrange
    const payload = {
      email: 'user-test@mail.com',
      password: 'password',
      name: 'user test',
    };

    await UsersTableTestHelper.addUser({ email: payload.email });

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat user baru karena email sudah digunakan');
  });

  describe('when create user mother', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        role: 'mother',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    // create test for not meet data specification error
    it('should response 400 when request payload not meet data specification', async () => {
      // Arrange
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: true,
        role: 'mother',
        bpjsKesehatanNumber: 1234567890123456,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    // create test for nik not in nik format return error
    it('should response 400 when nik is not nik format', async () => {
      // Arrange
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: 'aaaaa',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: true,
        role: 'mother',
        bpjsKesehatanNumber: '1234567890123456',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena NIK tidak valid');
    });

    // create test for nik availability
    it('should response 400 when nik already registered', async () => {
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: true,
        role: 'mother',
        bpjsKesehatanNumber: '1234567890123456',
      };
      await UsersTableTestHelper.addUser({ nik: payload.nik });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('NIK sudah digunakan');
    });

    // create test for phone availabitity
    it('should response 400 when phone number already registered', async () => {
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: true,
        role: 'mother',
        bpjsKesehatanNumber: '1234567890123456',
      };

      await UsersTableTestHelper.addUser({ phoneNumber: payload.phoneNumber });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Nomor telepon sudah digunakan');
    });
  });
});
