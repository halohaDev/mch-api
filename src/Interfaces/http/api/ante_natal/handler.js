const AddAnteNatalCareUseCase = require("../../../../Applications/use_case/ante_natal/AddAnteNatalCareUseCase");

class AnteNatalCareHandler {
  constructor(container) {
    this._container = container;

    this.postAnteNatalCareHandler = this.postAnteNatalCareHandler.bind(this);
  }

  async postAnteNatalCareHandler(request, h) {
    const addAnteNatalUseCase = this._container.getInstance(
      AddAnteNatalCareUseCase.name
    );

    const result = await addAnteNatalUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        ...result,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = AnteNatalCareHandler;
