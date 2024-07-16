const MaternalRepository = require("../MaternalRepository");

describe("MaternalRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const maternalRepository = new MaternalRepository();

    // Action and Assert
    await expect(maternalRepository.addMaternal({})).rejects.toThrowError(
      "MATERNAL_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      maternalRepository.findMaternalByUserId("")
    ).rejects.toThrowError("MATERNAL_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      maternalRepository.updateMaternalByUserId("", {})
    ).rejects.toThrowError("MATERNAL_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(maternalRepository.showAllMaternal()).rejects.toThrowError(
      "MATERNAL_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(maternalRepository.findMaternalById("")).rejects.toThrowError(
      "MATERNAL_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
