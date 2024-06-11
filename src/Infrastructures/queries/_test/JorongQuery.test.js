const pool = require('../../database/postgres/pool');
const NagariTableTestHelper = require('../../../../tests/NagariTableTestHelper');
const JorongTableTestHelper = require('../../../../tests/JorongTableTestHelper');
const JorongQuery = require('../JorongQuery');

describe('JorongQuery', () => {
  afterEach(async () => {
    await JorongTableTestHelper.cleanTable();
    await NagariTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getByNagariId', () => {
    it('should return jorong correctly', async () => {
      // Arrange
      const jorongQuery = new JorongQuery({ pool });
      const queryParams = {
        nagariId: 'nag-1',
      }

      await NagariTableTestHelper.addNagari({ id: 'nag-1', name: 'Jorong Test' });
      await JorongTableTestHelper.addJorong({ id: 'nag-1', name: 'Nagari Test', nagariId: 'nag-1'});

      // Action
      const result = await jorongQuery.wheres(queryParams).paginate();

      // Assert
      expect(result.data).toHaveLength(1);
    });
  });
});
