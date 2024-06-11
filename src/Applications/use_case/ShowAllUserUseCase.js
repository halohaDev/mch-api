const ShowedUser = require('../../Domains/users/entities/ShowedUser');

class ShowAllUserUseCase {
  constructor({ userRepository, placementRepository }) {
    this._userRepository = userRepository;
    this._placementRepository = placementRepository;
  }

  async execute(queryParams) {
    const result = await this._userRepository.getUsers(queryParams);
    const userIds = result?.data?.map((user) => user.id);

    const placements = await this._placementRepository.getPlacementByMidwifeId(userIds);

    result.data = result?.data?.map((user) => {
      const userPlacement = placements.filter((placement) => placement.midwifeId === user.id);
      const showedUser = new ShowedUser({
        ...user,
      });

      showedUser.placements = userPlacement;

      return showedUser;
    });

    return result;
  }
}

module.exports = ShowAllUserUseCase;