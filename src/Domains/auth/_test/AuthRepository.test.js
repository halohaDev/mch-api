const AuthRepository = require("../AuthRepository");

describe("AuthRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const authRepository = new AuthRepository();

    // Action & Assert
    await expect(authRepository.addRefreshToken("")).rejects.toThrowError(
      "AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(authRepository.verifyRefreshToken("")).rejects.toThrowError(
      "AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(authRepository.showAuthenticatedUser("")).rejects.toThrowError(
      "AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
