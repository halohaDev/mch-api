const ShowJorong = require('../ShowJorong');

describe('ShowJorong entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'jorong-123',
    };

    // Action and Assert
    expect(() => new ShowJorong(payload)).toThrowError('SHOW_JORONG.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'jorong-123',
      name: 123,
      nagariId: 'nagari-123',
    };

    // Action and Assert
    expect(() => new ShowJorong(payload)).toThrowError('SHOW_JORONG.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create showJorong object correctly', () => {
    // Arrange
    const payload = {
      id: 'jorong-123',
      name: 'Jorong Test',
      nagariId: 'nagari-123',
    };

    // Action
    const { id, name, nagariId } = new ShowJorong(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(name).toEqual(payload.name);
    expect(nagariId).toEqual(payload.nagariId);
  });
});
