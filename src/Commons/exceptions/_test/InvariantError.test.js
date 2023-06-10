const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should throw error correctly', () => {
    const invariantError = new InvariantError('sample message');

    expect(invariantError.message).toEqual('sample message');
    expect(invariantError.name).toEqual('InvariantError');
    expect(invariantError.statusCode).toEqual(400);
  });
});
