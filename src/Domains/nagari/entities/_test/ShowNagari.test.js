const ShowNagari = require('../ShowNagari');

describe('a ShowNagari entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      name: 'Nagari A',
    };

    // Action & Assert
    expect(() => new ShowNagari(payload)).toThrowError('SHOW_NAGARI.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      name: 'Nagari A',
    };

    // Action & Assert
    expect(() => new ShowNagari(payload)).toThrowError('SHOW_NAGARI.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ShowNagari object correctly', () => {
    // Arrange
    const payload = {
      id: 'nagari-123',
      name: 'Nagari A',
    };

    // Action
    const { id, name } = new ShowNagari(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(name).toEqual(payload.name);
  });
});
