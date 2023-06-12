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
}

module.exports = AuthUseCase;
