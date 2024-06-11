const pool = require('../../database/postgres/pool');
const NagariTableTestHelper = require('../../../../tests/NagariTableTestHelper');
const NagariQuery = require('../NagariQuery');

describe('NagariQuery', () => {
  afterEach(async () => {
    await NagariTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getBySearch', () => {
    it('should return nagari correctly', async () => {
      // Arrange
      const nagariQuery = new NagariQuery({ pool });
      const queryParams = {
        search: 'Nagari Test',
      }

      await NagariTableTestHelper.addNagari({ name: 'Nagari Test' });

      // Action
      const result = await nagariQuery.wheres(queryParams).paginate();

      // Assert
      expect(result.data).toHaveLength(1);
    });
  });
});
