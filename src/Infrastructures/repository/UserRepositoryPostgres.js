const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CreatedUser = require("../../Domains/users/entities/CreatedUser");
const UserRepository = require("../../Domains/users/UserRepository");
const UserQuery = require("../queries/UserQuery");

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator, snakeToCamelObject) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._snakeToCamelObject = snakeToCamelObject;
    this._userQuery = new UserQuery({ pool });
  }

  async verifyAvailableEmail(email, userId) {
    let textQuery = "SELECT email FROM users WHERE email = $1";
    let values = [email];

    if (userId) {
      textQuery += " AND id != $2";
      values.push(userId);
    }

    const query = { text: textQuery, values };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("tidak dapat membuat user baru karena email sudah digunakan");
    }
  }

  async addUser(registerUser) {
    const { email, password, name, nik, role, address, birthPlace, dateOfBirth, jobTitle, religion, isActiveBpjs, bpjsKesehatanNumber } =
      registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO users(id, email, password, name, nik, role, address, birthplace, date_of_birth, job_title, religion, is_active_bpjs, bpjs_kesehatan_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, email, name, role",
      values: [
        id,
        email,
        password,
        name,
        nik,
        role,
        address,
        birthPlace,
        dateOfBirth,
        jobTitle,
        religion,
        isActiveBpjs,
        bpjsKesehatanNumber,
      ],
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

  async verifyAvailableNik(nik, userId) {
    let textQuery = "SELECT nik FROM users WHERE nik = $1";
    let values = [nik];

    if (userId) {
      textQuery += " AND id != $2";
      values.push(userId);
    }

    const query = { text: textQuery, values };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("NIK sudah digunakan");
    }

    return true;
  }

  async verifyAvailablePhoneNumber(phoneNumber, userId) {
    let textQuery = "SELECT phone_number FROM users WHERE phone_number = $1";
    let values = [phoneNumber];

    if (userId) {
      textQuery += " AND id != $2";
      values.push(userId);
    }

    const query = { text: textQuery, values };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("Nomor telepon sudah digunakan");
    }

    return true;
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("user tidak ditemukan");
    }

    return this._snakeToCamelObject(result.rows[0]);
  }

  async getUsers(queryParams) {
    const result = await this._userQuery.wheres(queryParams).paginate();
    return result;
  }

  async updateUserPetugas(id, updatedUser) {
    const { email, name, address, phoneNumber, role, nik } = updatedUser;

    const query = {
      text: "UPDATE users SET email = $1, name = $2, address = $3, phone_number = $4, role = $5, nik = $6 WHERE id = $7 RETURNING id, email, name, role",
      values: [email, name, address, phoneNumber, role, nik, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui petugas. Id tidak ditemukan");
    }

    return new CreatedUser({ ...result.rows[0] });
  }

  async getUsersByIds(userIds) {
    const userIdsString = userIds.join("','");
    const query = {
      text: `SELECT id, name FROM users WHERE id IN ('${userIdsString}')`,
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = UserRepositoryPostgres;
