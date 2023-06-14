const PasswordHash = require('../../Applications/security/PasswordHash');

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
      throw new Error('Nilai hash tidak sesuai');
    }
  }
}

module.exports = BcryptPasswordHash;
