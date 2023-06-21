const CreatePlacement = require('../CreatePlacement');

describe('CreatePlacement entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      midwifeId: 'midwife-123',
    };

    // Action and Assert
    expect(() => new CreatePlacement(payload)).toThrowError('CREATE_PLACEMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      midwifeId: 123,
      jorongId: 123,
      placementDate: '2021-08-08T07:00:00.000Z',
    };

    // Action and Assert
    expect(() => new CreatePlacement(payload)).toThrowError('CREATE_PLACEMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatePlacement object correctly', () => {
    // Arrange
    const payload = {
      midwifeId: 'midwife-123',
      jorongId: 'jorong-123',
      placementDate: '2021-08-08T07:00:00.000Z',
    };

    // Action
    const { midwifeId, jorongId, placementDate } = new CreatePlacement(payload);

    // Assert
    expect(midwifeId).toEqual(payload.midwifeId);
    expect(jorongId).toEqual(payload.jorongId);
    expect(placementDate).toEqual(payload.placementDate);
  });
});
