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

  it('should orchestrating the add user action correctly when create mother user', async () => {
    // Arrange
    const useCasePayload = {
      email: 'user-test@mail.com',
      password: 'secret',
      name: 'user test',
      nik: '1234567890123456',
      phoneNumber: '081234567890',
      address: 'user test address',
      dateOfBirth: '1999-12-12',
      birthplace: 'user test birthplace',
      jobTitle: 'user test job title',
      religion: 'user test religion',
      isActiveBpjs: true,
      bpjsKesehatanNumber: '1234567890123456',
      role: 'mother',
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
    mockUserRepository.verifyAvailableNik = jest.fn(() => Promise.resolve());
    mockUserRepository.verifyAvailablePhoneNumber = jest.fn(() => Promise.resolve());
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
    expect(mockUserRepository.verifyAvailableNik).toBeCalledWith(useCasePayload.nik);
    expect(mockUserRepository.verifyAvailableEmail).toBeCalledWith(useCasePayload.email);
    expect(mockUserRepository.verifyAvailablePhoneNumber)
      .toBeCalledWith(useCasePayload.phoneNumber);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new CreateUser({
      email: useCasePayload.email,
      password: 'encrypted_password',
      name: useCasePayload.name,
      nik: useCasePayload.nik,
      phoneNumber: useCasePayload.phoneNumber,
      address: useCasePayload.address,
      dateOfBirth: useCasePayload.dateOfBirth,
      birthplace: useCasePayload.birthplace,
      jobTitle: useCasePayload.jobTitle,
      religion: useCasePayload.religion,
      isActiveBpjs: useCasePayload.isActiveBpjs,
      bpjsKesehatanNumber: useCasePayload.bpjsKesehatanNumber,
      role: useCasePayload.role,
    }));
  });
});
