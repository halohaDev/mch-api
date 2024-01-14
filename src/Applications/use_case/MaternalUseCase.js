const NewMaternal = require("../../Domains/maternal/entities/NewMaternal");
const CreateUser = require("../../Domains/users/entities/CreateUser");

class MaternalUseCase {
  constructor({
    maternalRepository,
    userRepository,
    maternalHistoryRepository,
  }) {
    this._maternalRepository = maternalRepository;
    this._userRepository = userRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
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

  async updateMaternalStatus(useCasePayload) {
    const { userId: userId, maternalStatus } = useCasePayload;

    const { id: maternalId } =
      await this._maternalRepository.findMaternalByUserId(userId);

    const { id: maternalHistoryId } =
      await this._maternalHistoryRepository.findMaternalHistoryByMaternalId(
        maternalId
      );

    await this._maternalHistoryRepository.updateMaternalHistoryById(
      maternalHistoryId,
      maternalStatus
    );

    return { id: maternalId };
  }

  async showAllMaternal(queryParams) {
    return await this._maternalRepository.showAllMaternal(queryParams);
  }
}

module.exports = MaternalUseCase;
