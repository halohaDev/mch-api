const Jwt = require('@hapi/jwt');
const JsonWebToken = require('../JsonWebToken');

describe('JsonWebToken', () => {
  it('should create token correctly', async () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // mock function
    const mockToken = {
      generate: jest.fn().mockImplementation(() => 'mock_token'),
    };

    // instantiate class
    const tokenManager = new JsonWebToken(mockToken);

    // Action
    const accessToken = await tokenManager.createAccessToken(payload);

    // Assert
    expect(mockToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
    expect(accessToken).toEqual('mock_token');
  });

  it('should create refresh token correctly', async () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // mock function
    const mockToken = {
      generate: jest.fn().mockImplementation(() => 'mock_token'),
    };

    // instantiate class
    const tokenManager = new JsonWebToken(mockToken);

    // Action
    const refreshToken = await tokenManager.createRefreshToken(payload);

    // Assert
    expect(mockToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
    expect(refreshToken).toEqual('mock_token');
  });

  it('should thorw error when verify token not valid', async () => {
    // Arrange
    const tokenManager = new JsonWebToken(Jwt.token);
    const accessToken = await tokenManager.createAccessToken({ userId: 'user-123' });

    // Action && Assert
    await tokenManager.createRefreshToken({ userId: 'user-123' });
    await expect(tokenManager.verifyRefreshToken(accessToken)).rejects.toThrowError('Refresh token tidak valid');
  });

  it('should verify refresh token correctly', async () => {
    // Arrange
    const tokenManager = new JsonWebToken(Jwt.token);
    const refreshToken = await tokenManager.createRefreshToken({ userId: 'user-123' });

    // Action && Assert
    await expect(tokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrowError('InvariantError');
  });

  it('should decode payload correctly', async () => {
    // Arrange
    const tokenManager = new JsonWebToken(Jwt.token);
    const refreshToken = await tokenManager.createRefreshToken({ userId: 'user-123' });

    // Action
    const { userId: expectedUserId } = await tokenManager.decodePayload(refreshToken);

    // Assert
    expect(expectedUserId).toEqual('user-123');
  });
});
