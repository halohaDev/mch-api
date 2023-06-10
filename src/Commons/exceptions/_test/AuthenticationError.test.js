const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('sample message');

    expect(authenticationError.message).toEqual('sample message');
    expect(authenticationError.name).toEqual('AuthenticationError');
    expect(authenticationError.statusCode).toEqual(401);
  });
});
