const NewMaternal = require("../../Domains/maternal/entities/NewMaternal");
const CreateUser = require("../../Domains/users/entities/CreateUser");

class MaternalUseCase {
  constructor({
    maternalRepository,
    userRepository,
    maternalHistoryRepository,
    randomGenerator,
    databaseManager,
  }) {
    this._maternalRepository = maternalRepository;
    this._userRepository = userRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._randomGenerator = randomGenerator;
    this._databaseManager = databaseManager;
  }

  async addMaternal(useCasePayload) {
    const newMaternal = new NewMaternal(useCasePayload);
    await this._userRepository.getUserById(newMaternal.userId);
    const maternalId = await this._maternalRepository.addMaternal(newMaternal);
    return { id: maternalId };
  }

  async addUserMaternal(useCasePayload) {
    const { password } = useCasePayload;

    if (!password || password === "" || password === " ") {
      useCasePayload.password = this._randomGenerator();
    }

    try {
      this._databaseManager.beginTransaction();

      await this._userRepository.verifyAvailableEmail(useCasePayload.email);
      await this._userRepository.verifyAvailablePhoneNumber(useCasePayload.phoneNumber);
      await this._userRepository.verifyAvailableNik(useCasePayload.nik);
      
      const createUser = new CreateUser(useCasePayload);
      
      const { id: userId } = await this._userRepository.addUser(createUser);

      const newMaternal = new NewMaternal({ ...useCasePayload, userId });
      const maternalId = await this._maternalRepository.addMaternal(newMaternal);

      this._databaseManager.commitTransaction();
      return { id: maternalId };
    } catch (error) {
      this._databaseManager.rollbackTransaction();
      throw error;
    } finally {
      this._databaseManager.releaseClient();
    }
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
    const result = await this._maternalRepository.showAllMaternal(queryParams);

    return result;
  }

  async getMaternalUserById(maternalId) {
    const maternal = await this._maternalRepository.findMaternalById(maternalId);
    const user = await this._userRepository.getUserById(maternal.userId);
    
    return { ...maternal, user };
  }
}

module.exports = MaternalUseCase;
