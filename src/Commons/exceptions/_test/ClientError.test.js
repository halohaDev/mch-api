const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw error correctly', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract directly');
  });
});
