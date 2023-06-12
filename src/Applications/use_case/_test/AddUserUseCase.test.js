const CreatedUser = require('../../../Domains/users/entities/CreatedUser');
const CreateUser = require('../../../Domains/users/entities/CreateUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      email: 'user_test@mail.com',
      password: 'password',
      name: 'user test',
    };

    const mockCreatedUser = new CreatedUser({
      id: 'user-123',
      name: useCasePayload.name,
      email: useCasePayload.email,
    });

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // mocking needed function
    mockUserRepository.verifyAvailableEmail = jest.fn(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn(() => Promise.resolve(mockCreatedUser));

    // creating use case instance
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const createdUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(createdUser).toStrictEqual(mockCreatedUser);
    expect(mockUserRepository.verifyAvailableEmail).toBeCalledWith(useCasePayload.email);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new CreateUser({
      email: useCasePayload.email,
      password: 'encrypted_password',
      name: useCasePayload.name,
    }));
  });
});
