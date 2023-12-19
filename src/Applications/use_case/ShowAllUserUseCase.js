class ShowAllUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(queryParams) {
    return await this._userRepository.getAllUsers(queryParams);
  }
}
