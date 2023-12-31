const pool = require('../../database/postgres/pool');
const MaternalTableTestHelper = require('../../../../tests/MaternalTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('HTTP server - maternal', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await MaternalTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /maternal', () => {
    it('should response 201 and persisted maternal', async () => {
      // Arrange
      const requestPayload = {
        menarcheDate: '2021-08-22',
        martialDate: '2021-08-22',
        martialStatus: 'married',
        numberOfMarriage: '2',
      };

      const server = await createServer(container);

      // Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: {
          email: 'test-email@mail.com',
          password: 'secret_password',
          name: 'User Test',
        },
      });

      expect(userResponse.statusCode).toEqual(201);
      const { id } = JSON.parse(userResponse.payload).data.createdUser;

      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/maternal',
        payload: { ...requestPayload, userId: id },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.id).toBeDefined();

      const maternal = await MaternalTableTestHelper.findMaternalById(responseJson.data.id);
      expect(maternal).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/maternal',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('when POST /api/v1/mater', () => {
    it('should response 200 and presist user and maternal', async () => {
      // Arrange
      const useCasePayload = {
        name: 'User test',
        email: 'test@mail.com',
        password: 'secret',
        role: 'mother',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'Jalan jalan',
        birthplace: 'Padang',
        jobTitle: 'IRT',
        dateOfBirth: '2021-08-22',
        religion: 'Islam',
        isActiveBpjs: true,
        bpjsKesehatanNumber: '1234567890123456',
        menarcheDate: '2021-08-22',
        martialDate: '2021-08-22',
        numberOfMarriage: '1',
        martialStatus: 'single',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/maternal/user',
        payload: useCasePayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.id).toBeDefined();

      const maternal = await MaternalTableTestHelper.findMaternalById(responseJson.data.id);
      expect(maternal).toBeDefined();

      const user = await UsersTableTestHelper.findUserById(maternal.user_id);
      expect(user).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/maternal/user',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload data type is wrong', async () => {
      // Arrange
      const useCasePayload = {
        name: 'User test',
        email: 'test@mail.com',
        password: 'secret',
        role: 'mother',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'Jalan jalan',
        birthplace: 'Padang',
        jobTitle: 'IRT',
        dateOfBirth: '2021-08-22',
        religion: 'Islam',
        isActiveBpjs: true,
        bpjsKesehatanNumber: '1234567890123456',
        menarcheDate: '2021-08-22',
        martialDate: '2021-08-22',
        numberOfMarriage: 1,
        martialStatus: 1,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/maternal/user',
        payload: useCasePayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
