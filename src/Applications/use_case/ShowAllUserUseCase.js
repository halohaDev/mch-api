class ShowAllUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(queryParams) {
    return this._userRepository.getAllUsers(queryParams);
  }
}
