class ShowAllUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(queryParams) {
    return await this._userRepository.getUsers(queryParams);
  }
}

module.exports = ShowAllUserUseCase;