const MaternalUseCase = require("../MaternalUseCase");
const MaternalRepository = require("../../../Domains/maternal/MaternalRepository");
const UserRepository = require("../../../Domains/users/UserRepository");
const MaternalHistoryRepository = require("../../../Domains/maternal/MaternalHistoryRepository");
const NewMaternal = require("../../../Domains/maternal/entities/NewMaternal");
const CreateUser = require("../../../Domains/users/entities/CreateUser");

describe("MaternalUseCase", () => {
  describe("addMaternal function", () => {
    it("should orchestrating the add maternal action correctly", async () => {
      // Arrange
      const useCasePayload = {
        userId: "user-123",
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: "1",
        maritalStatus: "single",
      };

      /** creating dependency of use case */
      const mockMaternalRepository = new MaternalRepository();
      const mockUserRepository = new UserRepository();

      /** mocking needed function */
      mockUserRepository.getUserById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      mockMaternalRepository.addMaternal = jest
        .fn()
        .mockImplementation(() => Promise.resolve("123"));

      /** creating use case instance */
      const maternalUseCase = new MaternalUseCase({
        maternalRepository: mockMaternalRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const { id: maternalId } = await maternalUseCase.addMaternal(
        useCasePayload
      );

      // Assert
      expect(maternalId).toStrictEqual("123");
      expect(mockUserRepository.getUserById).toBeCalledWith(
        useCasePayload.userId
      );
      expect(mockMaternalRepository.addMaternal).toBeCalledWith(useCasePayload);
    });
  });

  describe("addUserMaternal User function", () => {
    it("should orchestrating the add user maternal action correctly", async () => {
      // Arrange
      const useCasePayload = {
        name: "User test",
        email: "test@mail.com",
        password: "secret",
        role: "mother",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "Jalan jalan",
        birthplace: "Padang",
        jobTitle: "IRT",
        dateOfBirth: "2021-08-22",
        religion: "Islam",
        isActiveBpjs: true,
        bpjsKesehatanNumber: "1234567890123456",
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: "1",
        maritalStatus: "single",
      };

      const createUser = new CreateUser({ ...useCasePayload });
      const newMaternal = new NewMaternal({
        ...useCasePayload,
        userId: "user-123",
      });

      /** creating dependency of use case */
      const mockMaternalRepository = new MaternalRepository();
      const mockUserRepository = new UserRepository();

      /** mocking needed function */
      mockUserRepository.addUser = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ id: "user-123" }));

      mockMaternalRepository.addMaternal = jest
        .fn()
        .mockImplementation(() => Promise.resolve("123"));

      /** creating use case instance */
      const maternalUseCase = new MaternalUseCase({
        maternalRepository: mockMaternalRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const { id: maternalId } = await maternalUseCase.addUserMaternal(
        useCasePayload
      );

      // Assert
      expect(maternalId).toStrictEqual("123");
      expect(mockUserRepository.addUser).toBeCalledWith(createUser);
      expect(mockMaternalRepository.addMaternal).toBeCalledWith(newMaternal);
    });

    it("should orchestrating the add user maternal action correctly when password is empty", async () => {
      // Arrange
      const useCasePayload = {
        name: "User test",
        email: "test@mail.com",
        password: "secret",
        role: "mother",
        nik: "1234567890123456",
        phoneNumber: "081234567890",
        address: "Jalan jalan",
        birthplace: "Padang",
        jobTitle: "IRT",
        dateOfBirth: "2021-08-22",
        religion: "Islam",
        isActiveBpjs: true,
        bpjsKesehatanNumber: "1234567890123456",
        menarcheDate: "2021-08-22",
        maritalDate: "2021-08-22",
        numberOfMarriage: "1",
        maritalStatus: "single",
      };

      /** creating dependency of use case */
      const mockMaternalRepository = new MaternalRepository();
      const mockUserRepository = new UserRepository();

      /** mocking needed function */
      const mockRandomGenerator = jest.fn().mockImplementation(() => "secret");

      mockUserRepository.addUser = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ id: "user-123" }));

      mockMaternalRepository.addMaternal = jest
        .fn()
        .mockImplementation(() => Promise.resolve("123"));

      /** creating use case instance */
      const maternalUseCase = new MaternalUseCase({
        maternalRepository: mockMaternalRepository,
        userRepository: mockUserRepository,
        randomGenerator: mockRandomGenerator,
      });

      // Action
      const { id: maternalId } = await maternalUseCase.addUserMaternal(
        useCasePayload
      );

      // Assert
      expect(maternalId).toStrictEqual("123");
      expect(mockUserRepository.addUser).toBeCalledWith(
        expect.objectContaining({
          password: expect.any(String),
        })
      );
      expect(mockMaternalRepository.addMaternal).toBeCalledWith(
        expect.objectContaining({
          userId: expect.any(String),
        })
      );
    });
  });

  describe("updateMaternalStatus function", () => {
    it("should orchestrating the update maternal status action correctly", async () => {
      // Arrange
      const useCasePayload = {
        userId: "user-123",
        maternalStatus: "abortus",
      };

      /** creating dependency of use case */
      const mockMaternalRepository = new MaternalRepository();
      const mockMaternalHistoryRepository = new MaternalHistoryRepository();

      /** mocking needed function */
      mockMaternalRepository.findMaternalByUserId = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ id: "maternal-123" }));

      mockMaternalHistoryRepository.findMaternalHistoryByMaternalId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ id: "maternal-history-123" })
        );

      mockMaternalHistoryRepository.updateMaternalHistoryById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const maternalUseCase = new MaternalUseCase({
        maternalRepository: mockMaternalRepository,
        maternalHistoryRepository: mockMaternalHistoryRepository,
      });

      // Action
      await maternalUseCase.updateMaternalStatus(useCasePayload);

      // Assert
      expect(mockMaternalRepository.findMaternalByUserId).toBeCalledWith(
        useCasePayload.userId
      );
      expect(
        mockMaternalHistoryRepository.findMaternalHistoryByMaternalId
      ).toBeCalledWith("maternal-123");
      expect(
        mockMaternalHistoryRepository.updateMaternalHistoryById
      ).toBeCalledWith("maternal-history-123", useCasePayload.maternalStatus);
    });
  });

  describe("showAllMaternal function", () => {
    it("should orchestrating the show all maternal action correctly", async () => {
      // Arrange
      const useCasePayload = {
        page: 1,
        limit: 10,
      };

      /** creating dependency of use case */
      const mockMaternalRepository = new MaternalRepository();

      /** mocking needed function */
      mockMaternalRepository.showAllMaternal = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      /** creating use case instance */
      const maternalUseCase = new MaternalUseCase({
        maternalRepository: mockMaternalRepository,
      });

      // Action
      await maternalUseCase.showAllMaternal(useCasePayload);

      // Assert
      expect(mockMaternalRepository.showAllMaternal).toBeCalledWith(
        useCasePayload
      );
    });
  });
});
