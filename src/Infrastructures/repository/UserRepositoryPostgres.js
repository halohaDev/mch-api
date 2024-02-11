const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CreatedUser = require("../../Domains/users/entities/CreatedUser");
const UserRepository = require("../../Domains/users/UserRepository");
const UserQuery = require("../queries/UserQuery");

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._userQuery = new UserQuery({ pool });
  }

  async verifyAvailableEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(
        "tidak dapat membuat user baru karena email sudah digunakan"
      );
    }
  }

  async addUser(registerUser) {
    const { email, password, name } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO users(id, email, name, password) VALUES($1, $2, $3, $4) RETURNING id, email, name",
      values: [id, email, name, password],
    };

    const result = await this._pool.query(query);

    return new CreatedUser({ ...result.rows[0] });
  }

  async getPasswordByEmail(email) {
    const query = {
      text: "SELECT password FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("email yang anda masukkan tidak ditemukan");
    }

    return result.rows[0].password;
  }

  async getIdByEmail(email) {
    const query = {
      text: "SELECT id FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("email yang anda masukkan tidak ditemukan");
    }

    return result.rows[0].id;
  }

  async verifyAvailableNik(nik) {
    const query = {
      text: "SELECT nik FROM users WHERE nik = $1",
      values: [nik],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("NIK sudah digunakan");
    }

    return true;
  }

  async verifyAvailablePhoneNumber(phoneNumber) {
    const query = {
      text: "SELECT phone_number FROM users WHERE phone_number = $1",
      values: [phoneNumber],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("Nomor telepon sudah digunakan");
    }

    return true;
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, name, email, phone_number, nik, role FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("user tidak ditemukan");
    }

    return result.rows[0];
  }

  async getUsers(queryParams) {
    const result = await this._userQuery.wheres(queryParams).paginate();
    return result;
  }
}

module.exports = UserRepositoryPostgres;
