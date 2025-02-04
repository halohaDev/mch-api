const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');
const ShowAllUserUseCase = require('../../../../Applications/use_case/ShowAllUserUseCase');
const UpdateUserUseCase = require('../../../../Applications/use_case/UpdateUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.putUserByIdHandler = this.putUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const createdUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        createdUser,
      },
    });

    response.code(201);
    return response;
  }

  async getUsersHandler(request, h) {
    const showAllUserUseCase = this._container.getInstance(ShowAllUserUseCase.name);
    
    const users = await showAllUserUseCase.execute(request.query);

    const response = h.response({
      status: 'success',
      data: users.data,
      meta: users.meta,
    });

    response.code(200);
    return response;
  }

  async putUserByIdHandler(request, h) {
    const { id } = request.params;
    const { payload } = request;

    const useCasePayload = {
      id,
      ...payload,
    };

    const updateUserUseCase = this._container.getInstance(UpdateUserUseCase.name);
    const updatedUser = await updateUserUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        ...updatedUser,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = UsersHandler;
