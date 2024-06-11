const CreatePlacement = require('../../Domains/placements/entities/CreatePlacement');
const ShowedPlacement = require('../../Domains/placements/entities/ShowedPlacement');

class PlacementUseCase {
  constructor({ placementRepository, userRepository, jorongRepository, snakeToCamelObject }) {
    this._placementRepository = placementRepository;
    this._userRepository = userRepository;
    this._jorongRepository = jorongRepository;
    this._snakeToCamelObject = snakeToCamelObject
  }

  async addPlacement(useCasePayload) {
    const createPlacement = new CreatePlacement(useCasePayload);

    await this._jorongRepository.getJorongById(createPlacement.jorongId);
    await this._userRepository.getUserById(createPlacement.midwifeId);

    return this._placementRepository.addPlacement(useCasePayload);
  }

  async getPlacementByMidwifeId(midwifeId) {
    await this._userRepository.getUserById(midwifeId);

    return await this._placementRepository.getPlacementByMidwifeId(midwifeId);
  }
}

module.exports = PlacementUseCase;
