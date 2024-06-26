const AddAnteNatalCareUseCase = require('../../../../Applications/use_case/ante_natal/AddAnteNatalCareUseCase');

class MaternalServiceHandler {
  constructor(container) {
    this._container = container;

    this.postAnteNatalCareHandler = this.postAnteNatalCareHandler.bind(this);
  }

  async postAnteNatalCareHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { payload } = {
      ...request.payload,
      userId,
    };
    const addAnteNatalCareUseCase = this._container.getInstance(AddAnteNatalCareUseCase.name);
    const addedAnteNatalCare = await addAnteNatalCareUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedAnteNatalCare,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = MaternalServiceHandler;
