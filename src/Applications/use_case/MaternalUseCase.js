const NewMaternal = require('../../Domains/maternal/entities/NewMaternal');
const CreateUser = require('../../Domains/users/entities/CreateUser');

class MaternalUseCase {
  constructor({ maternalRepository, userRepository }) {
    this._maternalRepository = maternalRepository;
    this._userRepository = userRepository;
  }

  async addMaternal(useCasePayload) {
    const newMaternal = new NewMaternal(useCasePayload);
    await this._userRepository.getUserById(newMaternal.userId);
    const maternalId = await this._maternalRepository.addMaternal(newMaternal);
    return { id: maternalId };
  }

  async addUserMaternal(useCasePayload) {
    const createUser = new CreateUser(useCasePayload);
    const { id: userId } = await this._userRepository.addUser(createUser);

    const newMaternal = new NewMaternal({ ...useCasePayload, userId });
    const maternalId = await this._maternalRepository.addMaternal(newMaternal);
    return { id: maternalId };
  }
}

module.exports = MaternalUseCase;
