class PlacementUseCase {
  constructor({ placementRepository, userRepository, jorongRepository }) {
    this._placementRepository = placementRepository;
    this._userRepository = userRepository;
    this._jorongRepository = jorongRepository;
  }

  async addPlacement(useCasePayload) {
    await this._jorongRepository.getJorongById(useCasePayload.jorongId);
    await this._userRepository.getUserById(useCasePayload.midwifeId);

    return this._placementRepository.addPlacement(useCasePayload);
  }
}

module.exports = PlacementUseCase;
