const AnteNatalCareRepository = require("../../../../Domains/ante_natal/AnteNatalCareRepository");
const ShowAnteNatalCareUseCase = require("../../ante_natal/ShowAnteNatalCareUseCase");

describe("ShowAnteNatalCareUseCase", () => {
  it("should orchestrating the show ante natal action correctly", async () => {
    // Arrange
    const useCasePayload = {
      maternalHistoryId: "maternal-history-123",
    };

    /** creating dependency of use case */
    const mockAnteNatalCareRepository = new AnteNatalCareRepository();
    mockAnteNatalCareRepository.showAnteNatalCare = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const showAnteNatalUseCase = new ShowAnteNatalCareUseCase({
      anteNatalCareRepository: mockAnteNatalCareRepository,
    });

    // Action
    await showAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(mockAnteNatalCareRepository.showAnteNatalCare).toBeCalledWith(
      useCasePayload
    );
  });
});
