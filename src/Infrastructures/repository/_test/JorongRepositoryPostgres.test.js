const JorongRepositoryPostgres = require('../JorongRepositoryPostgres');
const CreateJorong = require('../../../Domains/jorong/entities/CreateJorong');
const pool = require('../../database/postgres/pool');
const JorongTableTestHelper = require('../../../../tests/JorongTableTestHelper');
const NagariTableTestHelper = require('../../../../tests/NagariTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('JorongRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await JorongTableTestHelper.cleanTable();
    await NagariTableTestHelper.cleanTable();
  });

  describe('addJorong function', () => {
    it('should return created jorong correctly', async () => {
      // Arrange
      const createJorong = new CreateJorong({
        name: 'Jorong Test',
        nagariId: 'nagari-123',
      });

      await NagariTableTestHelper.addNagari({ id: 'nagari-123' });
      const fakeIdGenerator = () => '123';
      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdJorong = await jorongRepositoryPostgres.addJorong(createJorong);

      // Assert
      const jorong = await JorongTableTestHelper.findJorongById('jorong-123');
      expect(createdJorong).toStrictEqual({
        id: 'jorong-123',
        name: 'jorong test',
        nagari_id: 'nagari-123',
      });
      expect(jorong).toHaveLength(1);
    });
  });

  describe('verifyAvailableJorongName function', () => {
    it('should throw InvariantError when jorong name not available', async () => {
      // Arrange
      const name = 'jorong test';

      await JorongTableTestHelper.addJorong({ name });

      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(jorongRepositoryPostgres.verifyAvailableJorongName(name))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when jorong name available', async () => {
      // Arrange
      const name = 'Jorong Test';
      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(jorongRepositoryPostgres.verifyAvailableJorongName(name))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('getJorongById function', () => {
    // throw error not found
    it('should throw NotFoundError when jorong not found', async () => {
      // Arrange
      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(jorongRepositoryPostgres.getJorongById('jorong-123'))
        .rejects.toThrowError(NotFoundError);
    });

    // return jorong
    it('should return jorong correctly', async () => {
      // Arrange
      await NagariTableTestHelper.addNagari({ id: 'nagari-123' });
      await JorongTableTestHelper.addJorong({ id: 'jorong-123', name: 'jorong test', nagari_id: 'nagari-123' });
      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, {});

      // Action
      const jorong = await jorongRepositoryPostgres.getJorongById('jorong-123');

      // Assert
      expect(jorong).toStrictEqual({
        id: 'jorong-123',
        name: 'jorong test',
        nagari_id: 'nagari-123',
      });
    });
  });
});
