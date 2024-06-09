const UpdateUser = require('../../Domains/users/entities/UpdateUser');

class UpdateUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { id } = useCasePayload;
    
    const user = await this._userRepository.getUserById(id);

    const newUser = {
      ...user,
      ...useCasePayload,
    };

    console.log(newUser);

    const updatedUser = new UpdateUser(newUser);
    const { email, nik, phoneNumber } = updatedUser;

    await this._userRepository.verifyAvailableEmail(email);
    await this._userRepository.verifyAvailableNik(nik);
    await this._userRepository.verifyAvailablePhoneNumber(phoneNumber);

    const result = await this._userRepository.updateUserPetugas(id, updatedUser);

    return result;
  }
}

module.exports = UpdateUserUseCase;