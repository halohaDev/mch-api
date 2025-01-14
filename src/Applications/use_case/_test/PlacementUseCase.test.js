const PlacementUseCase = require('../PlacementUseCase');
const PlacementRepository = require('../../../Domains/placements/PlacementRepository');
const ShowedPlacement = require('../../../Domains/placements/entities/ShowedPlacement');
const UserRepository = require('../../../Domains/users/UserRepository');
const JorongRepository = require('../../../Domains/jorong/JorongRepository');

describe('PlacementUseCase', () => {
  describe('addPlacement function', () => {
    it('should orchestrating the add placement action correctly', async () => {
      // Arrange
      const useCasePayload = {
        midwifeId: 'midwife-123',
        jorongId: 'jorong-123',
        placementDate: '2021-01-01T00:00:00.000Z',
      };

      const expectedPlacement = {
        midwifeId: useCasePayload.midwifeId,
        jorongId: useCasePayload.jorongId,
      };

      // create dependency of use case
      const mockPlacementRepository = new PlacementRepository();
      const mockUserRepository = new UserRepository();
      const mockJorongRepository = new JorongRepository();

      // mock function
      mockJorongRepository.getJorongById = jest.fn(() => Promise.resolve());
      mockUserRepository.getUserById = jest.fn(() => Promise.resolve());
      mockPlacementRepository.addPlacement = jest.fn(() => Promise.resolve(expectedPlacement));

      // create use case instance
      const placementUseCase = new PlacementUseCase({
        placementRepository: mockPlacementRepository,
        userRepository: mockUserRepository,
        jorongRepository: mockJorongRepository,
      });

      // Action
      const placement = await placementUseCase.addPlacement(useCasePayload);

      // Assert
      expect(placement).toBeDefined();
      expect(mockJorongRepository.getJorongById).toBeCalledWith(useCasePayload.jorongId);
      expect(mockUserRepository.getUserById).toBeCalledWith(useCasePayload.midwifeId);
    });
  });

  describe('getPlacementByMidwifeId function', () => {
    it('should orchestrating the get placement by midwife id action correctly', async () => {
      // Arrange
      const midwifeId = 'midwife-123';

      const expectedPlacements = [
        new ShowedPlacement({
          midwifeId: 'midwife-123',
          jorongId: 'jorong-123',
          jorongName: 'jorong name',
          placementDate: '2021-01-01T00:00:00.000Z',
          nagariName: 'nagari name',
        }),
      ];

      // create dependency of use case
      const mockPlacementRepository = new PlacementRepository();
      const mockUserRepository = new UserRepository();

      // mock function
      mockUserRepository.getUserById = jest.fn(() => Promise.resolve());
      mockPlacementRepository.getPlacementByMidwifeId = jest.fn(() => Promise.resolve(expectedPlacements));

      // create use case instance
      const placementUseCase = new PlacementUseCase({
        placementRepository: mockPlacementRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const placements = await placementUseCase.getPlacementByMidwifeId(midwifeId);

      // Assert
      expect(placements).toStrictEqual(expectedPlacements);
      expect(mockUserRepository.getUserById).toBeCalledWith(midwifeId);
    });
  });
});
