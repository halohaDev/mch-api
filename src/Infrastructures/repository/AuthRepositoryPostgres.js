const AuthRepository = require('../../Domains/auth/AuthRepository');

class AuthRepositoryPostgres extends AuthRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addRefreshToken(token) {
    const findQuery = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(findQuery);

    if (result.rowCount) {
      throw new Error('REFRESH_TOKEN_REPOSITORY.REFRESH_TOKEN_ALREADY_EXISTS');
    }

    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('REFRESH_TOKEN_REPOSITORY.NOT_FOUND');
    }
  }
}

module.exports = AuthRepositoryPostgres;
