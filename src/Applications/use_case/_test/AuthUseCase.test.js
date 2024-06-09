const AuthUseCase = require("../AuthUseCase");
const Auth = require("../../../Domains/auth/entities/Auth");
const Authenticated = require("../../../Domains/auth/entities/Authenticated");
const AuthRepository = require("../../../Domains/auth/AuthRepository");
const UserRepository = require("../../../Domains/users/UserRepository");
const PlacementRepository = require("../../../Domains/placements/PlacementRepository");
const AuthTokenManager = require("../../security/AuthTokenManager");
const PasswordHash = require("../../security/PasswordHash");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("AuthUseCase interface", () => {
  describe("login use case", () => {
    it("should orchestrating action correctly", async () => {
      // Arrange
      const useCasePayload = {
        email: "user-test@mail.com",
        password: "password",
      };

      const expectedAuth = new Auth({
        refreshToken: "refresh_token",
        accessToken: "access_token",
      });

      // mock dependency
      const mockAuthRepository = new AuthRepository();
      const mockUserRepository = new UserRepository();
      const mockAuthTokenManager = new AuthTokenManager();
      const mockPasswordHash = new PasswordHash();

      // mock function
      mockUserRepository.getPasswordByEmail = jest.fn(() =>
        Promise.resolve("encrypted_password")
      );
      mockPasswordHash.comparePassword = jest.fn(() => Promise.resolve());
      mockAuthTokenManager.createAccessToken = jest.fn(() =>
        Promise.resolve(expectedAuth.accessToken)
      );
      mockAuthTokenManager.createRefreshToken = jest.fn(() =>
        Promise.resolve(expectedAuth.refreshToken)
      );
      mockUserRepository.getIdByEmail = jest.fn(() =>
        Promise.resolve("user-123")
      );

      mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
        id: "user-123",
        role: "admin",
      }));

      mockAuthRepository.addRefreshToken = jest.fn(() => Promise.resolve());

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
        userRepository: mockUserRepository,
        tokenManager: mockAuthTokenManager,
        passwordHash: mockPasswordHash,
      });

      // Action
      const auth = await authUseCase.login(useCasePayload);

      // Assert
      expect(auth).toStrictEqual(expectedAuth);
      expect(mockUserRepository.getPasswordByEmail).toBeCalledWith(
        useCasePayload.email
      );
      expect(mockPasswordHash.comparePassword).toBeCalledWith(
        useCasePayload.password,
        "encrypted_password"
      );
      expect(mockAuthTokenManager.createAccessToken).toBeCalledWith({
        userId: "user-123", role: "admin"
      });
      expect(mockAuthTokenManager.createRefreshToken).toBeCalledWith({
        userId: "user-123", role: "admin"
      });
      expect(mockUserRepository.getIdByEmail).toBeCalledWith(
        useCasePayload.email
      );

      expect(mockUserRepository.getUserById).toBeCalledWith("user-123");

      expect(mockAuthRepository.addRefreshToken).toBeCalledWith(
        expectedAuth.refreshToken
      );
    });

    it("should throw error if use case payload not contain email or password", async () => {
      // Arrange
      const useCasePayload = {
        email: "user@mail.com",
      };

      // mock dependency
      const mockAuthRepository = new AuthRepository();
      const mockUserRepository = new UserRepository();

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
        userRepository: mockUserRepository,
      });

      // Action & Assert
      await expect(authUseCase.login(useCasePayload)).rejects.toThrowError(
        "AUTH_USE_CASE.NOT_CONTAIN_EMAIL_OR_PASSWORD"
      );
    });

    it("should throw error when data not meet data type specification", async () => {
      // Arrange
      const useCasePayload = {
        email: 1234,
        password: "password",
      };

      // mock dependency
      const mockAuthRepository = new AuthRepository();

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
      });

      // Action & Assert
      await expect(authUseCase.login(useCasePayload)).rejects.toThrowError(
        "AUTH_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });
  });

  describe("refreshToken use case", () => {
    it("should return error if refresh token not in payload", async () => {
      // Arrange
      const useCasePayload = {};

      // mock dependency
      const mockAuthRepository = new AuthRepository();

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
      });

      // Action & Assert
      await expect(
        authUseCase.refreshToken(useCasePayload)
      ).rejects.toThrowError("AUTH_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN");
    });

    it("sould return error if refresh token not string", async () => {
      // Arrange
      const useCasePayload = {
        refreshToken: 123,
      };

      // mock dependency
      const mockAuthRepository = new AuthRepository();

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
      });

      // Action & Assert
      await expect(
        authUseCase.refreshToken(useCasePayload)
      ).rejects.toThrowError(
        "AUTH_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    it("should orchestrating action correctly", async () => {
      // Arrange
      const useCasePayload = {
        refreshToken: "refresh_token",
      };

      // mock dependency
      const mockAuthRepository = new AuthRepository();
      const mockAuthTokenManager = new AuthTokenManager();

      // mock function
      mockAuthRepository.verifyRefreshToken = jest.fn(() => Promise.resolve());
      mockAuthTokenManager.verifyRefreshToken = jest.fn(() =>
        Promise.resolve()
      );
      mockAuthTokenManager.decodePayload = jest.fn(() =>
        Promise.resolve({ userId: "user-123" })
      );
      mockAuthTokenManager.createAccessToken = jest.fn(() =>
        Promise.resolve("access_token")
      );

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
        tokenManager: mockAuthTokenManager,
      });

      // Action
      const accessToken = await authUseCase.refreshToken(useCasePayload);

      // Assert
      expect(mockAuthRepository.verifyRefreshToken).toBeCalledWith(
        useCasePayload.refreshToken
      );
      expect(mockAuthTokenManager.verifyRefreshToken).toBeCalledWith(
        useCasePayload.refreshToken
      );
      expect(mockAuthTokenManager.decodePayload).toBeCalledWith(
        useCasePayload.refreshToken
      );
      expect(mockAuthTokenManager.createAccessToken).toBeCalledWith({
        userId: "user-123",
      });
      expect(accessToken).toEqual("access_token");
    });
  });

  describe("showAuthenticatedUser use case", () => {
    it("should orchestrating action correctly", async () => {
      // Arrange
      const useCasePayload = {
        userId: "user-123",
      };

      const expectedAuthenticated = new Authenticated({
        id: "user-123",
        email: "user@mail.com",
        name: "user",
        role: "user",
        placements: [{ id: "placement-123", name: "placement" }],
      });

      // mock dependency
      const mockAuthRepository = new AuthRepository();
      const mockUserRepository = new UserRepository();
      const mockPlacementRepository = new PlacementRepository();

      // mock function
      mockAuthRepository.verifyAccessToken = jest.fn(() => Promise.resolve());
      mockUserRepository.getUserById = jest.fn(() =>
        Promise.resolve({
          id: "user-123",
          email: "user@mail.com",
          name: "user",
          role: "user",
        })
      );
      mockPlacementRepository.getPlacementByMidwifeId = jest.fn(() =>
        Promise.resolve([{ id: "placement-123", name: "placement" }])
      );

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
        userRepository: mockUserRepository,
        placementRepository: mockPlacementRepository,
      });

      // Action
      const authenticated = await authUseCase.showAuthenticatedUser(
        useCasePayload
      );

      // Assert
      expect(authenticated).toStrictEqual(expectedAuthenticated);
    });

    it("should throw error if use case payload not found userId", async () => {
      // Arrange
      const useCasePayload = {};

      // mock dependency
      const mockAuthRepository = new AuthRepository();
      const mockUserRepository = new UserRepository();
      const mockPlacementRepository = new PlacementRepository();

      // mock function to return NotFoundError
      mockUserRepository.getUserById = jest.fn(() =>
        Promise.reject(new NotFoundError("user not found"))
      );

      // use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepository,
        userRepository: mockUserRepository,
        placementRepository: mockPlacementRepository,
      });

      // Action & Assert
      await expect(
        authUseCase.showAuthenticatedUser(useCasePayload)
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
