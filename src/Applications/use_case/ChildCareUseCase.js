const NewChildCare = require("../../Domains/child_care/entities/NewChildCare");

class ChildCareUseCase {
  constructor({ childCareRepository, childRepository, userRepository, jorongRepository }) {
    this.childCareRepository = childCareRepository;
    this.childRepository = childRepository;
    this.userRepository = userRepository;
    this.jorongRepository = jorongRepository;
  }

  async createChildCare(payload) {
    const newChildCare = new NewChildCare(payload);

    await this.childRepository.findChildById(newChildCare.childId);
    await this.userRepository.getUserById(newChildCare.midwifeId);
    await this.jorongRepository.getJorongById(newChildCare.jorongId);

    const result = await this.childCareRepository.addChildCare(newChildCare);

    return result;
  }

  async showChildCares(queryParams) {
    const result = await this.childCareRepository.showChildCares(queryParams);

    // if queryParams has includeChild
    if (queryParams.includeChild) {
      const childIds = result.data.map((childCare) => childCare.childId);
      const children = await this.childRepository.getChildByIds(childIds);

      result.data = result.data.map((childCare) => {
        const child = children.find((child) => child.id === childCare.childId);
        return { ...childCare, child };
      });
    }

    // if query params has includeMidwife
    if (queryParams.includeMidwife) {
      const userIds = result.data.map((childCare) => childCare.userId);
      const users = await this.userRepository.getUserByIds(userIds);

      result.data = result.data.map((childCare) => {
        const user = users.find((user) => user.id === childCare.userId);
        return { ...childCare, user };
      });
    }

    // if query params has includeJorong
    if (queryParams.includeJorong) {
      const jorongIds = result.data.map((childCare) => childCare.jorongId);
      const jorongs = await this.jorongRepository.getJorongByIds(jorongIds);

      result.data = result.data.map((childCare) => {
        const jorong = jorongs.find((jorong) => jorong.id === childCare.jorongId);
        return { ...childCare, jorong };
      });
    }

    return result;
  }

  async getChildCareById(childCareId) {
    const result = await this.childCareRepository.findChildCareById(childCareId);

    return result;
  }

  async updateChildCare(childCareId, payload) {
    const newChildCare = new NewChildCare(payload);

    await this.childCareRepository.findChildCareById(childCareId);
    await this.childRepository.findChildById(newChildCare.childId);
    await this.userRepository.getUserById(newChildCare.midwifeId);
    await this.jorongRepository.getJorongById(newChildCare.jorongId);

    const result = await this.childCareRepository.updateChildCare(childCareId, newChildCare);

    return result;
  }

  async deleteChildCare(childCareId) {
    await this.childCareRepository.findChildCareById(childCareId);

    const result = await this.childCareRepository.deleteChildCareById(childCareId);

    return result;
  }
}

module.exports = ChildCareUseCase;
