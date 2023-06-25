const MaternalUseCase = require('../../../../Applications/use_case/MaternalUseCase');

class MaternalHandler {
  constructor(container) {
    this._container = container;

    this.postMaternalHandler = this.postMaternalHandler.bind(this);
    this.postMaternalUserHandler = this.postMaternalUserHandler.bind(this);
  }

  async postMaternalHandler(request, h) {
    const maternalUseCase = this._container.getInstance(MaternalUseCase.name);
    const createdMaternal = await maternalUseCase.addMaternal(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        ...createdMaternal,
      },
    });

    response.code(201);
    return response;
  }

  async postMaternalUserHandler(request, h) {
    const maternalUseCase = this._container.getInstance(MaternalUseCase.name);
    const createdMaternal = await maternalUseCase.addUserMaternal(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        ...createdMaternal,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = MaternalHandler;
