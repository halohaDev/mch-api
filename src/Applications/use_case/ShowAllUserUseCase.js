const ShowedUser = require('../../Domains/users/entities/ShowedUser');

class ShowAllUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(queryParams) {
    const result = await this._userRepository.getUsers(queryParams);

    result?.data?.map((user) => {
      return new ShowedUser(user);
    });

    return result;
  }
}

module.exports = ShowAllUserUseCase;