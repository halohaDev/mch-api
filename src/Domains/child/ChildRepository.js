class ChildRepository {
  async addChild(addChild) {
    throw new Error("CHILD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getChildByMaternalId() {
    throw new Error("CHILD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async showChilds() {
    throw new Error("CHILD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ChildRepository;
