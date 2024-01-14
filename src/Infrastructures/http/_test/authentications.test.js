const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('HTTP server - authentications', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /api/v1/login', () => {
    it('should response 201 and persisted authentication', async () => {
      // Arrange
      const requestPayload = {
        email: 'user-test@gmail.com',
        password: 'password',
      };
      const server = await createServer(container);

      // inject data
      await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          email: 'user-test@gmail.com',
          password: 'password',
          name: 'test',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: requestPayload.email,
          password: requestPayload.password,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should reponse 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        email: 'user@mail.com',
        password: 'password',
      };

      const server = await createServer(container);

      // inject data
      await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          email: requestPayload.email,
          password: requestPayload.password,
          name: 'test',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: requestPayload.email,
          password: 'wrong_password',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should reponse 400 if request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        email: 'user@mail.com',
        password: 'password',
      };

      const server = await createServer(container);

      // inject data
      await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          email: requestPayload.email,
          password: requestPayload.password,
          name: 'test',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: requestPayload.email,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan email dan password');
    });

    it('should reponse 400 if request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);

      // inject data
      await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          email: 'user@mail.com',
          password: 'password',
          name: 'test',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/login',
        payload: {
          email: 1234,
          password: 'password',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('autentikasi gagal, payload tidak sesuai');
    });
  });
});
