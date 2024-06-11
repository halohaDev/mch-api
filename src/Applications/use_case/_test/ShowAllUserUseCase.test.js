const ShowAllUserUseCase = require('../ShowAllUserUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const PlacementRepository = require('../../../Domains/placements/PlacementRepository');

describe('ShowAllUserUseCase', () => {
  it('should orchestrating the show all user action correctly', async () => {
    // Arrange
    const mockUserRepository = new UserRepository();
    const mockPlacementRepository = new PlacementRepository();

    mockUserRepository.getUsers = jest.fn(() => Promise.resolve({data: []}));
    mockPlacementRepository.getPlacementByMidwifeId = jest.fn(() => Promise.resolve());

    const showAllUserUseCase = new ShowAllUserUseCase({
      userRepository: mockUserRepository,
      placementRepository: mockPlacementRepository,
    });

    // Action
    await showAllUserUseCase.execute();

    // Assert
    expect(mockUserRepository.getUsers).toBeCalled();
    expect(mockPlacementRepository.getPlacementByMidwifeId).toBeCalled();
  });
});
