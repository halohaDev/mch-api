const ShowAllUserUseCase = require('../ShowAllUserUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('ShowAllUserUseCase', () => {
  it('should orchestrating the show all user action correctly', async () => {
    // Arrange
    const mockUserRepository = new UserRepository();
    mockUserRepository.getUsers = jest.fn(() => Promise.resolve());

    const showAllUserUseCase = new ShowAllUserUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    await showAllUserUseCase.execute();

    // Assert
    expect(mockUserRepository.getUsers).toBeCalled();
  });
});
