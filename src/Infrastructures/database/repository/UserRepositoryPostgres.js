const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CreatedUser = require('../../../Domains/CreatedUser');
const UserRepository = require('../../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('email tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { email, password, name } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users(id, email, name, password) VALUES($1, $2, $3, $4) RETURNING id, email, name',
      values: [id, email, name, password],
    };

    const result = await this._pool.query(query);

    return new CreatedUser({ ...result.rows[0] });
  }
}

module.exports = UserRepositoryPostgres;
