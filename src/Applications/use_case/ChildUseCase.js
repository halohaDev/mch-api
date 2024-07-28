class ChildUseCase {
  constructor({ childRepository, maternalRepository }) {
    this._childRepository = childRepository;
    this._maternalRepository = maternalRepository;
  }

  async showChildUseCase(queryParams) {
    const result = await this._childRepository.showChilds(queryParams);
    const maternalIds = result.data.map((child) => child.maternalId);

    const maternals = await this._maternalRepository.getMaternalByIds(maternalIds);

    result.data = result.data.map((child) => {
      const maternal = maternals.find((maternal) => maternal.id === child.maternalId);
      return {
        ...child,
        maternal: maternal,
      };
    });

    return result;
  }
}

module.exports = ChildUseCase;
