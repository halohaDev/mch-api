const pool = require('../../database/postgres/pool');
const NagariTableTestHelper = require('../../../../tests/NagariTableTestHelper');
const JorongTableTestHelper = require('../../../../tests/JorongTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server - jorong', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await NagariTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
  });

  describe('when POST /api/v1/jorong', () => {
    it('should response 201 and persisted jorong', async () => {
      // Arrange
      const requestPayload = {
        name: 'Jorong Test',
        nagariId: 'nagari-123',
      };

      await NagariTableTestHelper.addNagari({ id: 'nagari-123' });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/jorong',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.id).toBeDefined();

      const jorong = await JorongTableTestHelper.findJorongById(responseJson.data.id);
      expect(jorong).toHaveLength(1);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/jorong',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat jorong baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        name: 'Jorong Test',
        nagariId: 123,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/jorong',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat jorong baru karena tipe data tidak sesuai');
    });

    it('should response 404 when nagari not found', async () => {
      // Arrange
      const requestPayload = {
        name: 'Jorong Test',
        nagariId: 'nagari-123',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/jorong',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('nagari tidak ditemukan');
    });
  });
});
