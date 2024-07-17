const AddAnteNatalUseCase = require("../../ante_natal/AddAnteNatalCareUseCase");
const AnteNatalCareRepository = require("../../../../Domains/ante_natal/AnteNatalCareRepository");
const MaternalHistoryRepository = require("../../../../Domains/maternal/MaternalHistoryRepository");
const AddAnteNatalCare = require("../../../../Domains/ante_natal/entities/AddAnteNatalCare");
const DatabaseManager = require("../../../../Applications/DatabaseManager");
const UserRepository = require("../../../../Domains/users/UserRepository");
const ChildRepository = require("../../../../Domains/child/ChildRepository");
const DateHelper = require("../../../utils/DateHelper");

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
    const mockDatabaseManager = new DatabaseManager();
    const mockUserRepository = new UserRepository();
    const mockChildRepository = new ChildRepository();
    const mockDateHelper = new DateHelper();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalCareRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
      databaseManager: mockDatabaseManager,
      userRepository: mockUserRepository,
      dateHelper: mockDateHelper,
      childRepository: mockChildRepository,
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
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve({ id: "maternal-history-123", maternalId: "maternal-123" })
    );
    mockMaternalHistoryRepository.updateMaternalHistoryById = jest.fn(() => Promise.resolve({ id: "maternal-history-123" }));
    mockAnteNatalRepository.addAnteNatalCare = jest.fn(() => Promise.resolve());
    mockDatabaseManager.beginTransaction = jest.fn();
    mockDatabaseManager.commitTransaction = jest.fn();
    mockDatabaseManager.releaseClient = jest.fn();
    mockDatabaseManager.rollbackTransaction = jest.fn();
    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({ id: "user-123", dateOfBirth: "1990-01-01" }));
    mockChildRepository.getChildByMaternalId = jest.fn(() =>
      Promise.resolve([
        {
          id: "child-123",
          birthDatetime: "2021-08-01 00:00:00",
        },
      ])
    );
    mockDateHelper.addDays = jest.fn(() => new Date("2021-08-01"));
    mockDateHelper.getDiffInYears = jest.fn(() => 30);
    mockAnteNatalRepository.updateRiskStatus = jest.fn(() => Promise.resolve());

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(mockMaternalHistoryRepository.getMaternalHistoryByMaternalId).toBeCalledWith(useCasePayload.maternalId);
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
    const mockDatabaseManager = new DatabaseManager();
    const mockUserRepository = new UserRepository();
    const mockChildRepository = new ChildRepository();
    const mockDateHelper = new DateHelper();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalCareRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
      databaseManager: mockDatabaseManager,
      userRepository: mockUserRepository,
      dateHelper: mockDateHelper,
      childRepository: mockChildRepository,
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
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve({ id: "maternal-history-123", maternalId: "maternal-123" })
    );
    mockMaternalHistoryRepository.updateMaternalHistoryById = jest.fn(() => Promise.resolve({ id: "maternal-history-123" }));
    mockAnteNatalRepository.addAnteNatalCare = jest.fn(() => Promise.resolve());
    mockDatabaseManager.beginTransaction = jest.fn();
    mockDatabaseManager.commitTransaction = jest.fn();
    mockDatabaseManager.releaseClient = jest.fn();
    mockDatabaseManager.rollbackTransaction = jest.fn();
    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({ id: "user-123", dateOfBirth: "1990-01-01" }));
    mockChildRepository.getChildByMaternalId = jest.fn(() =>
      Promise.resolve([
        {
          id: "child-123",
          birthDatetime: "2021-08-01 00:00:00",
        },
      ])
    );
    mockAnteNatalRepository.updateRiskStatus = jest.fn(() => Promise.resolve());
    mockDateHelper.addDays = jest.fn(() => new Date("2021-08-01"));
    mockDateHelper.getDiffInYears = jest.fn(() => 30);

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(mockMaternalHistoryRepository.getMaternalHistoryByMaternalId).toBeCalledWith(useCasePayload.maternalId);
    expect(mockMaternalHistoryRepository.updateMaternalHistoryById).toBeCalledWith("maternal-history-123", { maternalStatus: "pregnant" });
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
    const mockDatabaseManager = new DatabaseManager();
    const mockUserRepository = new UserRepository();
    const mockChildRepository = new ChildRepository();
    const mockDateHelper = new DateHelper();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalCareRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
      databaseManager: mockDatabaseManager,
      userRepository: mockUserRepository,
      dateHelper: mockDateHelper,
      childRepository: mockChildRepository,
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
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve({ id: "maternal-history-123", maternalId: "maternal-123" })
    );
    mockAnteNatalRepository.addAnteNatalCare = jest.fn(() => Promise.resolve());
    mockDatabaseManager.beginTransaction = jest.fn();
    mockDatabaseManager.commitTransaction = jest.fn();
    mockDatabaseManager.releaseClient = jest.fn();
    mockDatabaseManager.rollbackTransaction = jest.fn();
    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({ id: "user-123", dateOfBirth: "1990-01-01" }));
    mockChildRepository.getChildByMaternalId = jest.fn(() =>
      Promise.resolve([
        {
          id: "child-123",
          birthDatetime: "2021-08-01 00:00:00",
        },
      ])
    );
    mockDateHelper.addDays = jest.fn(() => new Date("2021-08-01"));
    mockAnteNatalRepository.updateRiskStatus = jest.fn(() => Promise.resolve());
    mockMaternalHistoryRepository.updateMaternalHistoryById = jest.fn(() => Promise.resolve({ id: "maternal-history-123" }));
    mockDateHelper.getDiffInYears = jest.fn(() => 30);

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(mockMaternalHistoryRepository.getMaternalHistoryByMaternalId).toBeCalledWith(useCasePayload.maternalId);
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
