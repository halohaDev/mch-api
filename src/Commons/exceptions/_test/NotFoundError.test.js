const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create instance correctly', () => {
    const notFoundError = new NotFoundError('sample message');

    expect(notFoundError.message).toEqual('sample message');
    expect(notFoundError.name).toEqual('NotFoundError');
    expect(notFoundError.statusCode).toEqual(404);
  });
});
