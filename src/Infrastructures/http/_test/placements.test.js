const pool = require('../../database/postgres/pool');
const PlacementsTableTestHelper = require('../../../../tests/PlacementsTableTestHelper');
const NagariTableTestHelper = require('../../../../tests/NagariTableTestHelper');
const JorongTableTestHelper = require('../../../../tests/JorongTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server - placements', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await PlacementsTableTestHelper.cleanTable();
    await NagariTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await NagariTableTestHelper.addNagari({ id: 'nagari-123' });
    await JorongTableTestHelper.addJorong({ id: 'jorong-123' });
  });

  describe('when POST /placements', () => {
    it('should response 201 and persisted placement', async () => {
      // Arrange
      const userId = 'user-123';
      const jorongId = 'jorong-123';
      const payload = {
        midwifeId: userId,
        jorongId,
        placementDate: '2021-08-22',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/placements',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const userId = 'user-123';
      const payload = {
        name: 'placement test',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/placements',
        payload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: userId,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat penempatan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const userId = 'user-123';
      const payload = {
        midwifeId: userId,
        jorongId: 123,
        placementDate: '2021-08-22',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/placements',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
