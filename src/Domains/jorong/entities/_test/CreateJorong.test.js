const CreateJorong = require('../CreateJorong');

describe('CreateJorong entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      name: 'Jorong Test',
    };

    // Action and Assert
    expect(() => new CreateJorong(payload)).toThrowError('CREATE_JORONG.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 'Jorong Test',
      nagariId: 123,
    };

    // Action and Assert
    expect(() => new CreateJorong(payload)).toThrowError('CREATE_JORONG.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createJorong object correctly', () => {
    // Arrange
    const payload = {
      name: 'Jorong Test',
      nagariId: 'nagari-123',
    };

    // Action
    const { name, nagariId } = new CreateJorong(payload);

    // Assert
    expect(name).toEqual(payload.name);
    expect(nagariId).toEqual(payload.nagariId);
  });
});
