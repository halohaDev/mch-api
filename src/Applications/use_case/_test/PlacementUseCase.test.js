const PlacementUseCase = require('../PlacementUseCase');
const PlacementRepository = require('../../../Domains/placements/PlacementRepository');
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
      mockJorongRepository.findJorongById = jest.fn(() => Promise.resolve());
      mockUserRepository.findUserById = jest.fn(() => Promise.resolve());
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
      expect(mockJorongRepository.findJorongById).toBeCalledWith(useCasePayload.jorongId);
      expect(mockUserRepository.findUserById).toBeCalledWith(useCasePayload.midwifeId);
    });
  });
});
