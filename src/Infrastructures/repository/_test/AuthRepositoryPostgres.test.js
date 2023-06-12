const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthRepositoryPostgres = require('../AuthRepositoryPostgres');

describe('AuthRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('addRefreshToken function', () => {
    it('should persist refresh token', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

      // Action
      await authRepositoryPostgres.addRefreshToken('refresh_token');

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken('refresh_token');
      expect(tokens).toHaveLength(1);
    });

    it('should throw InvariantError when add refresh token that have been persisted', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);
      await AuthenticationsTableTestHelper.addToken('refresh_token');

      // Action & Assert
      await expect(authRepositoryPostgres.addRefreshToken('refresh_token')).rejects.toThrowError('REFRESH_TOKEN_REPOSITORY.REFRESH_TOKEN_ALREADY_EXISTS');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when refresh token not found', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

      // Action & Assert
      await expect(authRepositoryPostgres.verifyRefreshToken('refresh_token')).rejects.toThrowError('REFRESH_TOKEN_REPOSITORY.NOT_FOUND');
    });

    it('should not throw InvariantError when refresh token found', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);
      await AuthenticationsTableTestHelper.addToken('refresh_token');

      // Action & Assert
      await expect(authRepositoryPostgres.verifyRefreshToken('refresh_token')).resolves.not.toThrowError('REFRESH_TOKEN_REPOSITORY.NOT_FOUND');
    });
  });
});
