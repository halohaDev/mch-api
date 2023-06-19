const pool = require('../../database/postgres/pool');
const NagariTableTestHelper = require('../../../../tests/NagariTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CreateNagari = require('../../../Domains/nagari/entities/CreateNagari');
const ShowNagari = require('../../../Domains/nagari/entities/ShowNagari');
const NagariRepositoryPostgres = require('../NagariRepositoryPostgres');

describe('NagariRepositoryPostgres', () => {
  afterEach(async () => {
    await NagariTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addNagari function', () => {
    it('should return created nagari correctly', async () => {
      // Arrange
      const createNagari = new CreateNagari({
        name: 'Nagari Test',
      });

      const fakeIdGenerator = () => '123';
      const nagariRepositoryPostgres = new NagariRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdNagari = await nagariRepositoryPostgres.addNagari(createNagari);

      // Assert
      const nagari = await NagariTableTestHelper.findNagariById('nagari-123');
      expect(createdNagari).toStrictEqual(new ShowNagari({
        id: 'nagari-123',
        name: 'Nagari Test',
      }));
      expect(nagari).toHaveLength(1);
    });
  });

  describe('verifyAvailableNagariName function', () => {
    it('should throw InvariantError when nagari name not available', async () => {
      // Arrange
      const name = 'Nagari Test';

      await NagariTableTestHelper.addNagari({ name: 'Nagari Test' });

      const nagariRepositoryPostgres = new NagariRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(nagariRepositoryPostgres.verifyAvailableNagariName(name))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when nagari name available', async () => {
      // Arrange
      const name = 'Nagari Test';
      const nagariRepositoryPostgres = new NagariRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(nagariRepositoryPostgres.verifyAvailableNagariName(name))
        .resolves.not.toThrowError(InvariantError);
    });
  });
});
