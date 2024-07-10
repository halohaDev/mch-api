const NewPostNatalCare = require("../../../Domains/post_natal/entities/NewPostNatalCare");

class AddPostNatalCareUseCase {
  constructor({ postNatalCareRepository, maternalHistoryRepository, jorongRepository }) {
    this._postNatalCareRepository = postNatalCareRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._jorongRepository = jorongRepository;
  }

  async execute(payload) {
    const newPostNatalCare = new NewPostNatalCare(payload);

    await this._maternalHistoryRepository.getMaternalHistoryById(newPostNatalCare.maternalHistoryId);
    await this._jorongRepository.getJorongById(newPostNatalCare.jorongId);

    return this._postNatalCareRepository.addPostNatalCare(newPostNatalCare);
  }
}

module.exports = AddPostNatalCareUseCase;