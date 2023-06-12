const Auth = require('../Auth');

describe('Auth entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    // Action & Assert
    expect(() => new Auth(payload)).toThrowError('AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 123,
      refreshToken: 'refresh_token',
    };

    // Action & Assert
    expect(() => new Auth(payload)).toThrowError('AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create auth object correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    // Action
    const { accessToken, refreshToken } = new Auth(payload);

    // Assert
    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
