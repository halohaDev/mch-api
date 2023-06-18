const CreateUser = require('../../Domains/users/entities/CreateUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const createUser = new CreateUser(useCasePayload);
    await this._userRepository.verifyAvailableEmail(createUser.email);

    if (createUser.role === 'mother') {
      await this._userRepository.verifyAvailableNik(createUser.nik);
      await this._userRepository.verifyAvailablePhoneNumber(createUser.phoneNumber);
    }

    createUser.password = await this._passwordHash.hash(createUser.password);
    return this._userRepository.addUser(createUser);
  }
}

module.exports = AddUserUseCase;
