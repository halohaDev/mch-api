const AddAnteNatalUseCase = require("../../ante_natal/AddAnteNatalCareUseCase");
const AnteNatalCareRepository = require("../../../../Domains/ante_natal/AnteNatalCareRepository");
const MaternalHistoryRepository = require("../../../../Domains/maternal/MaternalHistoryRepository");
const AddAnteNatalCare = require("../../../../Domains/ante_natal/entities/AddAnteNatalCare");

describe("AddAnteNatalUseCase", () => {
  it("should create new maternal history when no active maternal history", async () => {
    // Arrange
    const useCasePayload = {
      maternalId: "maternal-123",
      contactType: "c1",
      action: "action",
      ttImunization: "4",
      height: 160,
      hemoglobin: 12,
      weight: 50,
      bloodPressure: 120,
      fundalHeight: 10,
      fetalHeartRate: 120,
      hbsag: "negative",
      hiv: "negative",
      syphilis: "negative",
      bloodType: "A",
      usgCheckDate: "2021-08-01",
      jorongId: "jorong-123",
      midwifeId: "user-123",
      upperArmCircumference: 10,
    };

    // mock dependency
    const mockAnteNatalRepository = new AnteNatalCareRepository();
    const mockMaternalHistoryRepository = new MaternalHistoryRepository();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalCareRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
    });

    // mock function
    mockMaternalHistoryRepository.getMaternalHistoryByMaternalId = jest.fn(() =>
      Promise.resolve([])
    );
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve({ id: "maternal-history-123" })
    );
    mockAnteNatalRepository.addAnteNatalCare = jest.fn(() => Promise.resolve());

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockMaternalHistoryRepository.getMaternalHistoryByMaternalId
    ).toBeCalledWith(useCasePayload.maternalId);
    expect(mockMaternalHistoryRepository.addMaternalHistory).toBeCalled();
    expect(mockAnteNatalRepository.addAnteNatalCare).toBeCalled();
  });

  it("should update maternal history when it exists with non_pregnant status", async () => {
    // Arrange
    const useCasePayload = {
      maternalId: "maternal-123",
      contactType: "c1",
      action: "action",
      ttImunization: "4",
      height: 160,
      hemoglobin: 12,
      weight: 50,
      bloodPressure: 120,
      fundalHeight: 10,
      fetalHeartRate: 120,
      hbsag: "negative",
      hiv: "negative",
      syphilis: "negative",
      bloodType: "A",
      usgCheckDate: "2021-08-01",
      jorongId: "jorong-123",
      midwifeId: "user-123",
      upperArmCircumference: 10,
    };

    // mock dependency
    const mockAnteNatalRepository = new AnteNatalCareRepository();
    const mockMaternalHistoryRepository = new MaternalHistoryRepository();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalCareRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
    });

    // mock function
    mockMaternalHistoryRepository.getMaternalHistoryByMaternalId = jest.fn(() =>
      Promise.resolve([
        {
          id: "maternal-history-123",
          maternal_status: "non_pregnant",
        },
      ])
    );
    mockMaternalHistoryRepository.updateMaternalHistoryById = jest.fn(() =>
      Promise.resolve({ id: "maternal-history-123" })
    );
    mockAnteNatalRepository.addAnteNatalCare = jest.fn(() => Promise.resolve());

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockMaternalHistoryRepository.getMaternalHistoryByMaternalId
    ).toBeCalledWith(useCasePayload.maternalId);
    expect(
      mockMaternalHistoryRepository.updateMaternalHistoryById
    ).toBeCalledWith("maternal-history-123", { maternalStatus: "pregnant" });
  });

  it("should orchestrize action correctly", async () => {
    // Arrange
    const useCasePayload = {
      maternalId: "maternal-123",
      contactType: "c1",
      action: "action",
      ttImunization: "4",
      height: 160,
      hemoglobin: 12,
      weight: 50,
      bloodPressure: 120,
      fundalHeight: 10,
      fetalHeartRate: 120,
      hbsag: "negative",
      hiv: "negative",
      syphilis: "negative",
      bloodType: "A",
      usgCheckDate: "2021-08-01",
      jorongId: "jorong-123",
      midwifeId: "user-123",
      upperArmCircumference: 10,
    };

    // mock dependency
    const mockAnteNatalRepository = new AnteNatalCareRepository();
    const mockMaternalHistoryRepository = new MaternalHistoryRepository();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalCareRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
    });

    // mock function
    mockMaternalHistoryRepository.getMaternalHistoryByMaternalId = jest.fn(() =>
      Promise.resolve([{}])
    );
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve({
        id: "maternal-history-123",
        maternal_status: "non_pregnant",
      })
    );
    mockAnteNatalRepository.addAnteNatalCare = jest.fn(() => Promise.resolve());

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockMaternalHistoryRepository.getMaternalHistoryByMaternalId
    ).toBeCalledWith(useCasePayload.maternalId);
    expect(mockMaternalHistoryRepository.addMaternalHistory).toBeCalled();
    expect(mockAnteNatalRepository.addAnteNatalCare).toBeCalledWith(
      new AddAnteNatalCare({
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        bloodPressure: 120,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: "A",
        usgCheckDate: "2021-08-01",
        maternalHistoryId: "maternal-history-123",
        jorongId: "jorong-123",
        midwifeId: "user-123",
        upperArmCircumference: 10,
      })
    );
  });
});
