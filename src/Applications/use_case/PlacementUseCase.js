const CreatePlacement = require('../../Domains/placements/entities/CreatePlacement');

class PlacementUseCase {
  constructor({ placementRepository, userRepository, jorongRepository }) {
    this._placementRepository = placementRepository;
    this._userRepository = userRepository;
    this._jorongRepository = jorongRepository;
  }

  async addPlacement(useCasePayload) {
    const createPlacement = new CreatePlacement(useCasePayload);

    await this._jorongRepository.getJorongById(createPlacement.jorongId);
    await this._userRepository.getUserById(createPlacement.midwifeId);

    return this._placementRepository.addPlacement(useCasePayload);
  }
}

module.exports = PlacementUseCase;
