const CreatedUser = require('../CreatedUser');

describe('CreatedUser', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      email: 'user_test@mail.com',
    };

    // Action and Assert
    expect(() => new CreatedUser(payload)).toThrowError('CREATED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      email: 123,
      name: 123,
    };

    // Action and Assert
    expect(() => new CreatedUser(payload)).toThrowError('CREATED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should created object correctly', () => {
    // Arrange
    const payload = {
      email: 'user_test@mail.com',
      name: 'user_test',
    };

    // Action
    const createdUser = new CreatedUser(payload);

    // Assert
    expect(createdUser.email).toEqual(payload.email);
    expect(createdUser.name).toEqual(payload.name);
  });
});
