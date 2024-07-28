class ChildUseCase {
  constructor({ childRepository }) {
    this._childRepository = childRepository;
  }

  async showChildUseCase(queryParams) {
    const result = await this._childRepository.showChilds(queryParams);

    return result;
  }
}

module.exports = ChildUseCase;
