const AddAnteNatalUseCase = require("../../ante_natal/AddUseCase");
const AnteNatalCareRepository = require("../../../Domains/ante_natal/AnteNatalCareRepository");
const MaternalHistoryRepository = require("../../../Domains/maternal/MaternalHistoryRepository");

describe("AddAnteNatalUseCase", () => {
  describe("payload not contain needed property", () => {
    it("should throw error in c1", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
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
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should trhow error in c2", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c2",
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
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error in c3", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c3",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: "A",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error in c4", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c4",
        action: "action",
        ttImunization: "4",
        height: 160,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: "A",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error in c5", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c5",
        action: "action",
        ttImunization: "4",
        height: 160,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: "A",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error in c6", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c6",
        action: "action",
        ttImunization: "4",
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });
  });

  describe("payload not meet data type specification", () => {
    it("should throw error when placementId not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: 1234,
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
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when contactType not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: 1234,
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
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when action not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: 1234,
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
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when ttImunization not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: "action",
        ttImunization: 1234,
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
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when height not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: "test",
        hemoglobin: 12,
        weight: 50,
        bloodPressure: 120,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when hemoglobin not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: "test",
        weight: 50,
        bloodPressure: 120,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when weight not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: "test",
        bloodPressure: 120,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when bloodPressure not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        bloodPressure: "test",
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when fundalHeight not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c1",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        bloodPressure: 120,
        fundalHeight: "test",
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when fetalHeartRate not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c2",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: "test",
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when hbsag not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c2",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: 1234,
        hiv: "negative",
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when hiv not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c2",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: 1234,
        syphilis: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when syphilis not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c2",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: 1234,
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when bloodType not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c2",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
        syphilis: "negative",
        bloodType: 1234,
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when usgCheckDate not date", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c3",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        usgCheckDate: "test",
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when temprature not number", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c3",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        usgCheckDate: "2021-08-01",
        temprature: "test",
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when proteinInUrine not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c4",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        usgCheckDate: "2021-08-01",
        temprature: 36,
        proteinInUrine: 1234,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });

    it("should throw error when sugarInUrine not string", async () => {
      // Arrange
      const useCasePayload = {
        placementId: "placement-123",
        contactType: "c4",
        action: "action",
        ttImunization: "4",
        height: 160,
        hemoglobin: 12,
        usgCheckDate: "2021-08-01",
        temprature: 36,
        proteinInUrine: "negative",
        sugarInUrine: 1234,
        weight: 50,
        fundalHeight: 10,
        fetalHeartRate: 120,
        hbsag: "negative",
        hiv: "negative",
      };

      // mock dependency
      const mockAnteNatalRepository = new AnteNatalCareRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      // use case instance
      const addAnteNatalUseCase = new AddAnteNatalUseCase({
        anteNatalRepository: mockAnteNatalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action & Assert
      await expect(
        addAnteNatalUseCase.execute(useCasePayload)
      ).rejects.toThrowError("UnprocessableError");
    });
  });

  it("should create new maternal history when no active maternal history", async () => {
    // Arrange
    const useCasePayload = {
      placementId: "placement-123",
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
    };

    // mock dependency
    const mockAnteNatalRepository = new AnteNatalCareRepository();
    const mockMaternalHistoryRepository = new MaternalHistoryRepository();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
    });

    // mock function
    mockMaternalHistoryRepository.getMaternalHistoryByMaternalId = jest.fn(() =>
      Promise.resolve([])
    );
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve()
    );

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockMaternalHistoryRepository.getMaternalHistoryByMaternalId
    ).toBeCalledWith(useCasePayload.placementId);
    expect(mockMaternalHistoryRepository.addMaternalHistory).toBeCalled();
  });

  it("should update maternal history when it exists with non_pregnant status", async () => {
    // Arrange
    const useCasePayload = {
      placementId: "placement-123",
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
    };

    // mock dependency
    const mockAnteNatalRepository = new AnteNatalCareRepository();
    const mockMaternalHistoryRepository = new MaternalHistoryRepository();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
    });

    // mock function
    mockMaternalHistoryRepository.getMaternalHistoryByMaternalId = jest.fn(() =>
      Promise.resolve([
        {
          id: "maternal-history-123",
          status: "non_pregnant",
        },
      ])
    );
    mockMaternalHistoryRepository.updateMaternalHistory = jest.fn(() =>
      Promise.resolve()
    );

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockMaternalHistoryRepository.getMaternalHistoryByMaternalId
    ).toBeCalledWith(useCasePayload.placementId);
    expect(mockMaternalHistoryRepository.updateMaternalHistory).toBeCalled();
  });

  it("should orchestrize action correctly", async () => {
    // Arrange
    const useCasePayload = {
      placementId: "placement-123",
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
    };

    // mock dependency
    const mockAnteNatalRepository = new AnteNatalCareRepository();
    const mockMaternalHistoryRepository = new MaternalHistoryRepository();

    // use case instance
    const addAnteNatalUseCase = new AddAnteNatalUseCase({
      anteNatalRepository: mockAnteNatalRepository,
      maternalHistoryRepository: mockMaternalHistoryRepository,
    });

    // mock function
    mockMaternalHistoryRepository.getMaternalHistoryByMaternalId = jest.fn(() =>
      Promise.resolve([])
    );
    mockMaternalHistoryRepository.addMaternalHistory = jest.fn(() =>
      Promise.resolve()
    );
    mockAnteNatalRepository.addAnteNatal = jest.fn(() => Promise.resolve());

    // Action
    await addAnteNatalUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockMaternalHistoryRepository.getMaternalHistoryByMaternalId
    ).toBeCalledWith(useCasePayload.placementId);
    expect(mockMaternalHistoryRepository.addMaternalHistory).toBeCalled();
    expect(mockAnteNatalRepository.addAnteNatal).toBeCalled();
  });
});
