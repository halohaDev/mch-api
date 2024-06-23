const DatabaseManager = require('../../Applications/DatabaseManager');

describe('DatabaseManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const databaseManager = new DatabaseManager();

    // Action & Assert
    await expect(databaseManager.beginTransaction()).rejects.toThrowError('DATABASEMANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(databaseManager.commitTransaction()).rejects.toThrowError('DATABASEMANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
