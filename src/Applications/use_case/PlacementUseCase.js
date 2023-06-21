class PlacementUseCase {
  constructor({ placementRepository, userRepository, jorongRepository }) {
    this._placementRepository = placementRepository;
    this._userRepository = userRepository;
    this._jorongRepository = jorongRepository;
  }

  async addPlacement(useCasePayload) {
    await this._jorongRepository.findJorongById(useCasePayload.jorongId);
    await this._userRepository.findUserById(useCasePayload.midwifeId);

    return this._placementRepository.addPlacement(useCasePayload);
  }
}

module.exports = PlacementUseCase;
