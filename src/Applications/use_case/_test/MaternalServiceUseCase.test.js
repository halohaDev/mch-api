const MaternalServiceUseCase = require("../MaternalServiceUseCase")
const MaternalServiceRepository = require("../../../Domains/maternal/MaternalServiceRepository")
const MaternalRepository = require("../../../Domains/maternal/MaternalRepository")
const MaternalHistoryRepository = require("../../../Domains/maternal/MaternalHistoryRepository")
const AnteNatalCareRepository = require("../../../Domains/ante_natal/AnteNatalCareRepository")

describe("MaternalServiceUseCase", () => {
  describe("getLastServiceByMaternalId function", () => {
    it("should orchestrating the get last service by maternal id action correctly", async () => {
      // Arrange
      const maternalId = "maternal-123";

      /** creating dependency of use case */
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();
      const mockMaternalServiceRepository = new MaternalServiceRepository();
      const mockMaternalRepository = new MaternalRepository();

      /** mocking needed function */
      mockMaternalHistoryRepository.getLatestMaternalHistoryByMaternalId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({
            id: "maternal-history-123",
            maternalId: "maternal-123",
          })
        );

      mockMaternalServiceRepository.getLatestServiceByMaternalHistoryId = jest
        .fn() 
        .mockImplementation(() =>
          Promise.resolve({
            id: "maternal-service-123",
            maternalHistoryId: "maternal-history-123",
          })
        );

      mockMaternalRepository.findMaternalById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ userId: "authenticatedId" }));

      /** creating use case instance */
      const maternalServiceUseCase = new MaternalServiceUseCase({
        maternalHistoryRepository: mockMaternalHistoryRepository,
        maternalServiceRepository: mockMaternalServiceRepository,
        maternalRepository: mockMaternalRepository,
        databaseManager: {},
      });

      // Action
      const lastService = await maternalServiceUseCase.getLastServiceByMaternalId(
        maternalId, { id: "authenticatedId", role: "midwife"}
      );

      // Assert
      expect(lastService).toStrictEqual({
        id: "maternal-service-123",
        maternalHistoryId: "maternal-history-123",
      });
      expect(mockMaternalHistoryRepository.getLatestMaternalHistoryByMaternalId).toBeCalled();
      expect(mockMaternalServiceRepository.getLatestServiceByMaternalHistoryId).toBeCalled();
    });
  });

  describe("getLastServiceByMaternalHistoryId function", () => {
    it("should orchestrating the get last service by maternal history id action correctly", async () => {
      // Arrange
      const maternalHistoryId = "maternal-history-123";

      /** creating dependency of use case */
      const mockMaternalServiceRepository = new MaternalServiceRepository();
      const mockMaternalRepository = new MaternalRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      /** mocking needed function */
      mockMaternalServiceRepository.getLatestServiceByMaternalHistoryId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({
            id: "maternal-service-123",
            maternalHistoryId: "maternal-history-123",
          })
        );

      mockMaternalRepository.findMaternalById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ userId: "authenticatedId" }));

      mockMaternalHistoryRepository.getMaternalHistoryById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ maternalId: "maternal-123" }));

      /** creating use case instance */
      const maternalServiceUseCase = new MaternalServiceUseCase({
        anteNatalCareRepository: new AnteNatalCareRepository(),
        maternalHistoryRepository: mockMaternalHistoryRepository,
        maternalServiceRepository: mockMaternalServiceRepository,
        maternalRepository: mockMaternalRepository,
        databaseManager: {},
      });

      // Action
      const lastService = await maternalServiceUseCase.getLastServiceByMaternalHistoryId(
        maternalHistoryId, { id: "authenticatedId", role: "midwife" }
      );

      // Assert
      expect(lastService).toStrictEqual({
        id: "maternal-service-123",
        maternalHistoryId: "maternal-history-123",
      });
      expect(mockMaternalServiceRepository.getLatestServiceByMaternalHistoryId).toBeCalled();
    });
  });
});