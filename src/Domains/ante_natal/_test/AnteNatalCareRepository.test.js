const AnteNatalCareRepository = require("../AnteNatalCareRepository");

describe("AnteNatalCareRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const anteNatalCareRepository = new AnteNatalCareRepository();

    // Action and Assert
    await expect(
      anteNatalCareRepository.addAnteNatalCare({})
    ).rejects.toThrowError("ANTE_NATAL_CARE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      anteNatalCareRepository.showAnteNatalCares()
    ).rejects.toThrowError("ANTE_NATAL_CARE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
