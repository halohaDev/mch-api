const NagariUseCase = require('../../../../Applications/use_case/NagariUseCase');

class NagariHandler {
  constructor(container) {
    this._container = container;

    this.postNagariHandler = this.postNagariHandler.bind(this);
    this.getNagariHandler = this.getNagariHandler.bind(this);
  }

  async postNagariHandler(request, h) {
    const nagariUseCase = this._container.getInstance(NagariUseCase.name);
    const createdNagari = await nagariUseCase.addNagari(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        ...createdNagari,
      },
    });

    response.code(201);
    return response;
  }

  async getNagariHandler(request, h) {
    const nagariUseCase = this._container.getInstance(NagariUseCase.name);
    const result = await nagariUseCase.showNagari(request.query);

    const response = h.response({
      status: 'success',
      ...result,
    });

    response.code(200);
    return response;
  }
}

module.exports = NagariHandler;
