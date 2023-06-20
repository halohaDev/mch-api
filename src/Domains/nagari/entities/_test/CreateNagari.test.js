const CreateNagari = require('../CreateNagari');

describe('CreateNagari', () => {
  it('should throw error when name is empty', () => {
    // Arrange
    const payload = {
      name: '',
    };

    // Action & Assert
    expect(() => new CreateNagari(payload)).toThrowError('CREATE_NAGARI.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when name not string', () => {
    // Arrange
    const payload = {
      name: 123,
    };

    // Action & Assert
    expect(() => new CreateNagari(payload)).toThrowError('CREATE_NAGARI.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('return object correctly', () => {
    // Arrange
    const payload = {
      name: 'Nagari A',
    };

    // Action
    const { name } = new CreateNagari(payload);

    // Assert
    expect(name).toEqual(payload.name);
  });
});
