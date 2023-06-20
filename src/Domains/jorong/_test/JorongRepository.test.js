const JorongRepository = require('../JorongRepository');

describe('JorongRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const jorongRepository = new JorongRepository();

    // Action and Assert
    await expect(jorongRepository.addJorong({})).rejects.toThrowError('JORONG_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(jorongRepository.verifyAvailableJorongName('')).rejects.toThrowError('JORONG_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});