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

  describe('getJorong function', () => {
    it('should return jorong correctly', async () => {
      // Arrange
      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, {});

      await NagariTableTestHelper.addNagari({ name: 'Nagari Test' });
      await JorongTableTestHelper.addJorong({ id: 'nn', name: 'Jorong Test', nagariId: 'nagari-123' });

      // Action
      const jorong = await jorongRepositoryPostgres.getJorong();

      // Assert
      expect(jorong.data).toHaveLength(1);
    });

    it('should return onyl on nagari ID', async () => {
      // Arrange
      const jorongRepositoryPostgres = new JorongRepositoryPostgres(pool, {});

      await NagariTableTestHelper.addNagari({ id: 'j-1', name: 'Nagari Test' });
      await JorongTableTestHelper.addJorong({ name: 'Jorong Test', nagariId: 'j-1' });

      await NagariTableTestHelper.addNagari({ id: 'j-2', name: 'Nagari Test 2' });
      await JorongTableTestHelper.addJorong({ id: 'jn-2', name: 'Jorong Test 2', nagariId: 'j-2' });
      await JorongTableTestHelper.addJorong({ id: 'jn-3', name: 'Jorong Test 3', nagariId: 'j-2' });
      await JorongTableTestHelper.addJorong({ id: 'jn-4', name: 'Jorong Test 4', nagariId: 'j-2' });
      await JorongTableTestHelper.addJorong({ id: 'jn-5', name: 'Jorong Test 5', nagariId: 'j-2' });

      // Action
      const jorong = await jorongRepositoryPostgres.getJorong({ nagariId: 'j-2' });

      // Assert
      expect(jorong.data).toHaveLength(4);
    });
  });
});
