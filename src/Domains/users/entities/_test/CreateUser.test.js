const CreateUser = require('../CreateUser');

describe('CreateUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      email: 'user_test@test.com',
      password: 'secret',
    };

    // Action and Assert
    expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      email: 'test',
      password: 1,
      name: true,
    };

    // Action and Assert
    expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when email is not in email format', () => {
    // Arrange
    const payload = {
      email: 'test',
      password: 'secret',
      name: 'test mail',
    };

    // Action and Assert
    expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.EMAIL_IS_NOT_VALID');
  });

  it('should create CreateUser object correctly', () => {
    // Arrange
    const payload = {
      email: 'test@mail.com',
      password: 'secret',
      name: 'test mail',
    };

    // Action
    const { email, password, name } = new CreateUser(payload);

    // Assert
    expect(email).toEqual(payload.email);
    expect(password).toEqual(payload.password);
    expect(name).toEqual(payload.name);
  });
});
