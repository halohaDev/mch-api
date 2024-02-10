const PlacementRepository = require("../PlacementRepository");

describe("PlacementRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const placementRepository = new PlacementRepository();

    // Action and Assert
    await expect(placementRepository.addPlacement({})).rejects.toThrowError(
      "PLACEMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      placementRepository.findPlacementByIds("")
    ).rejects.toThrowError("PLACEMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      placementRepository.getPlacementByMidwifeId("")
    ).rejects.toThrowError("PLACEMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
