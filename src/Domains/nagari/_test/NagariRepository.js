const NagariRepository = require('../NagariRepository');

describe('NagariRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const nagariRepository = new NagariRepository();

    // Action & Assert
    await expect(nagariRepository.addNagari({})).rejects.toThrowError('NAGARI_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(nagariRepository.verifyAvailableNagariName('')).rejects.toThrowError('NAGARI_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(nagariRepository.getNagariById('')).rejects.toThrowError('NAGARI_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
