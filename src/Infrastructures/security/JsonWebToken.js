const AuthTokenManager = require('../../Applications/security/AuthTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JsonWebToken extends AuthTokenManager {
  constructor(token) {
    super();
    this._token = token;
  }

  async createAccessToken(payload) {
    return this._token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this._token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const artifacts = this._token.decode(refreshToken);
      this._token.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async decodePayload(refreshToken) {
    const artifacts = this._token.decode(refreshToken);
    return artifacts.decoded.payload;
  }
}

module.exports = JsonWebToken;
