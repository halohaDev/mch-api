const MaternalHistoryRepository = require("../MaternalHistoryRepository");

describe("MaternalHistoryRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const maternalHistoryRepository = new MaternalHistoryRepository();

    // Action and Assert
    await expect(
      maternalHistoryRepository.addMaternalHistory({})
    ).rejects.toThrowError(
      "MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      maternalHistoryRepository.getMaternalHistoryByPatientId("")
    ).rejects.toThrowError(
      "MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      maternalHistoryRepository.deleteMaternalHistoryById("")
    ).rejects.toThrowError(
      "MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      maternalHistoryRepository.updateMaternalHistoryById("", {})
    ).rejects.toThrowError(
      "MATERNAL_HISTORY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
