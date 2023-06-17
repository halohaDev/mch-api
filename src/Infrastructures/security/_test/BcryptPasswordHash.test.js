const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(spyHash).toBeCalledWith('plain_password', 10);
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
    });
  });

  describe('comparePassword', () => {
    it('should decrypt password correctly', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Action
      const result = await bcryptPasswordHash.comparePassword('plain_password', encryptedPassword);

      // Assert
      expect(spyCompare).toBeCalledWith('plain_password', encryptedPassword);
      expect(result).toEqual(true);
    });

    it('should throw AuthenticationError when password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action & Assert
      await expect(bcryptPasswordHash.comparePassword('plain_password', 'wrong_encrypted_password')).rejects.toThrowError('kredensial yang Anda masukkan salah');
    });
  });
});
