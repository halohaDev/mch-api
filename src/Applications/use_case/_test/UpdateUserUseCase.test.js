const UpdateUser = require('../../../Domains/users/entities/UpdateUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const UpdateUserUseCase = require('../UpdateUserUseCase');

describe('UpdateUserUseCase', () => {
  it('should orchestrating the update user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'user-123',
      email: 'user_change@mail.com',
      name: 'user change',
      role: 'admin',
      nik: '1234567890',
    };

    const currentUser = {
      id: 'user-123',
      name: 'user test',
      email: 'usertest@mail.com',
      role: 'admin',
      address: 'address',
      phoneNumber: '1234567890',
    }

    const mockUpdatedUser = new UpdateUser({
      id: 'user-123',
      name: useCasePayload.name,
      email: useCasePayload.email,
      role: 'admin',
      nik: useCasePayload.nik,
      address: 'address',
      phoneNumber: '1234567890',
    });

    const mockUserRepository = new UserRepository();

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve(currentUser));
    mockUserRepository.verifyAvailableEmail = jest.fn(() => Promise.resolve());
    mockUserRepository.verifyAvailableNik = jest.fn(() => Promise.resolve());
    mockUserRepository.verifyAvailablePhoneNumber = jest.fn(() => Promise.resolve());
    mockUserRepository.updateUserPetugas = jest.fn(() => Promise.resolve(mockUpdatedUser));

    const updateUserUseCase = new UpdateUserUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    const updatedUser = await updateUserUseCase.execute(useCasePayload);

    // Assert
    expect(updatedUser).toStrictEqual(mockUpdatedUser);
    expect(mockUserRepository.getUserById).toBeCalledWith(useCasePayload.id);
    expect(mockUserRepository.verifyAvailableEmail).toBeCalledWith(useCasePayload.email, useCasePayload.id);
    expect(mockUserRepository.verifyAvailableNik).toBeCalledWith(useCasePayload.nik, useCasePayload.id);
  });
});
