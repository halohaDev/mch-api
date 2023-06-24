const MaternalRepositoryPostgres = require('../MaternalRepositoryPostgres');
const MaternalTableTestHelper = require('../../../../tests/MaternalTableTestHelper');
const AddMaternal = require('../../../Domains/maternal/entities/NewMaternal');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('MaternalRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await MaternalTableTestHelper.cleanTable();
  });

  describe('addMaternal function', () => {
    it('should persist add maternal and return maternal id correctly', async () => {
      // Arrange
      const addMaternal = new AddMaternal({
        userId: 'user-123',
        menarcheDate: '2021-08-22',
        martialDate: '2021-08-22',
        numberOfMarriage: '1',
        martialStatus: 'single',
      });

      const fakeIdGenerator = () => '123';
      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const maternalId = await maternalRepositoryPostgres.addMaternal(addMaternal);

      // Assert
      const maternals = await MaternalTableTestHelper.findMaternalById('maternal-123');

      expect(maternalId).toStrictEqual('maternal-123');
      expect(maternals).toBeDefined();
    });
  });

  describe('findMaternalByUserId function', () => {
    it('should return maternal correctly', async () => {
      // Arrange
      const userId = 'user-123';

      await MaternalTableTestHelper.addMaternal({ id: 'maternal-123', userId });

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(pool, {});

      // Action
      const maternal = await maternalRepositoryPostgres.findMaternalByUserId(userId);

      // Assert
      const {
        id,
        maternal_date: maternalDate,
        martial_date: martialDate,
        number_of_marriage: numberOfMarriage,
        martial_status: martialStatus,
      } = maternal;

      expect(id).toStrictEqual('maternal-123');
      expect(new Date(maternalDate)).toBeInstanceOf(Date);
      expect(new Date(martialDate)).toBeInstanceOf(Date);
      expect(numberOfMarriage).toStrictEqual('1');
      expect(martialStatus).toStrictEqual('single');
    });

    it('shoudl throw NotFoundError when maternal not found', async () => {
      // Arrange
      const userId = 'user-123';

      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(maternalRepositoryPostgres.findMaternalByUserId(userId))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('updateMaternalByUserId function', () => {
    it('should update maternal correctly', async () => {
      // Arrange
      const userId = 'user-123';

      await MaternalTableTestHelper.addMaternal({ id: 'maternal-123', userId });

      const fakeIdGenerator = () => '123';
      const maternalRepositoryPostgres = new MaternalRepositoryPostgres(pool, fakeIdGenerator);

      const updateMaternal = {
        menarcheDate: '2021-08-22',
        martialDate: '2021-08-22',
        numberOfMarriage: '1',
        martialStatus: 'single',
      };

      // Action
      await maternalRepositoryPostgres.updateMaternalByUserId(userId, updateMaternal);

      // Assert
      const maternal = await MaternalTableTestHelper.findMaternalById('maternal-123');
      expect(maternal).toBeDefined();
    });
  });
});
