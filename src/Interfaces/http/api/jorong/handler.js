const JorongUseCase = require('../../../../Applications/use_case/JorongUseCase');

class JorongHandler {
  constructor(container) {
    this._container = container;

    this.postJorongHandler = this.postJorongHandler.bind(this);
  }

  async postJorongHandler(request, h) {
    const jorongUseCase = this._container.getInstance(JorongUseCase.name);
    const createdJorong = await jorongUseCase.addJorong(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        ...createdJorong,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = JorongHandler;