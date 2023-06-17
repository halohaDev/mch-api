const PasswordHash = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password, hashedPassword) {
    const comparisonResult = await this._bcrypt.compare(password, hashedPassword);

    if (!comparisonResult) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }

    return comparisonResult;
  }
}

module.exports = BcryptPasswordHash;
