class AddUseCase {
  constructor({ anteNatalRepository, maternalHistoryRepository, maternalRepository }) {
    this.anteNatalRepository = anteNatalRepository;
    this.maternalHistoryRepository = maternalHistoryRepository;
    this.maternalRepository = maternalRepository;
  }

  async execute(payload) {
    const { maternalId } = payload;
    const maternalHistory = await this.#getActiveMaternalHistory(maternalId);

    let maternalHistoryId = null;
    if (!maternalHistory) {
      maternalHistoryId = await this.maternalHistoryRepository.addMaternalHistory(payload);
    } else {
      maternalHistoryId = await this.maternalHistoryRepository.updateMaternalHistoryStatus('pregnant');
    }

    const anteNatal = await this.anteNatalRepository.addAnteNatal({
      maternal_history_id: materalHistoryId,
      ...payload
    });
  }

  async #getActiveMaternalHistory(maternalId) {
    const mh = await this.maternalHistoryRepository.getMaternalHistoryByMaternalId(maternalId);

    if (mh.maternal_status === 'pregnant' || mh.maternal_status === 'non_pregnant') {
      return mh;
    }

    return null;
  }

  async #addFirstContact(anteNatal) {
  }

  async #addSecondContact(anteNatal) {
  }

  async #addThirdContact(anteNatal) {
  }

  async #addFourthContact(anteNatal) {
  }

  async #addFifthContact(anteNatal) {
  }

  async #addSixthContact(anteNatal) {
  }
}

module.exports = AddUseCase;
