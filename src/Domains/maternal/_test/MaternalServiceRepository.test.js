const MaternalServiceRepository = require("../MaternalServiceRepository");

describe("MaternalServiceRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const maternalServiceRepository = new MaternalServiceRepository();

    // Action and Assert
    await expect(
      maternalServiceRepository.getLatestServiceByMaternalHistoryId()
    ).rejects.toThrowError("MATERNAL_SERVICE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      maternalServiceRepository.getServices()
    ).rejects.toThrowError("MATERNAL_SERVICE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});