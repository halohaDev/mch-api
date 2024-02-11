class AuthRepository {
  async addRefreshToken() {
    throw new Error("AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyRefreshToken() {
    throw new Error("AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async showAuthenticatedUser() {
    throw new Error("AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthRepository;
