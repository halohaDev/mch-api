const AuthTokenManager = require('../AuthTokenManager');

describe('AuthTokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authTokenManager = new AuthTokenManager();

    // Action & Assert
    await expect(authTokenManager.createAccessToken({})).rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(authTokenManager.createRefreshToken({})).rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(authTokenManager.verifyRefreshToken('')).rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(authTokenManager.decodePayload()).rejects.toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
