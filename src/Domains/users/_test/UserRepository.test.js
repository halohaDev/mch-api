const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action and Assert
    await expect(userRepository.addUser({})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyAvailableEmail('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getPasswordByEmail('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getIdByEmail('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyAvailablePhoneNumber('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyAvailableNik('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getUserById('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getUsers()).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
