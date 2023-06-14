const Auth = require('../../Domains/auth/entities/Auth');

class AuthUseCase {
  constructor({
    userRepository, authRepository, passwordHash, tokenManager,
  }) {
    this._userRepository = userRepository;
    this._authRepository = authRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
  }

  async login(useCasePayload) {
    this._verifyEmailAndPasswordPayload(useCasePayload);

    const { email, password } = useCasePayload;
    const hashedPassword = await this._userRepository.getPasswordByEmail(email);
    await this._passwordHash.comparePassword(password, hashedPassword);

    const userId = await this._userRepository.getIdByEmail(email);
    const accessToken = await this._tokenManager.createAccessToken({ userId });
    const refreshToken = await this._tokenManager.createRefreshToken({ userId });
    await this._authRepository.addRefreshToken(refreshToken);

    return new Auth({
      accessToken,
      refreshToken,
    });
  }

  async refreshToken(useCasePayload) {
    this._verifyRefreshTokenPayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    await this._authRepository.verifyRefreshToken(refreshToken);
    await this._tokenManager.verifyRefreshToken(refreshToken);

    const { userId } = await this._tokenManager.decodePayload(refreshToken);

    return this._tokenManager.createAccessToken({ userId });
  }

  _verifyRefreshTokenPayload(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('AUTH_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('AUTH_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyEmailAndPasswordPayload(payload) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new Error('AUTH_USE_CASE.NOT_CONTAIN_EMAIL_OR_PASSWORD');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('AUTH_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AuthUseCase;
