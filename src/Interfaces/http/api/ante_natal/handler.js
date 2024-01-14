const AddAnteNatalCareUseCase = require("../../../../Applications/use_case/ante_natal/AddAnteNatalCareUseCase");
const ShowAnteNatalCareUseCase = require("../../../../Applications/use_case/ante_natal/ShowAnteNatalCareUseCase");

class AnteNatalCareHandler {
  constructor(container) {
    this._container = container;

    this.postAnteNatalCareHandler = this.postAnteNatalCareHandler.bind(this);
    this.getAnteNatalCaresHandler = this.getAnteNatalCaresHandler.bind(this);
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

  async getAnteNatalCaresHandler(request, h) {
    const showAnteNatalUseCase = this._container.getInstance(
      ShowAnteNatalCareUseCase.name
    );

    const anteNatalCares = await showAnteNatalUseCase.execute(request.query);

    const response = h.response({
      status: "success",
      data: anteNatalCares.data,
      meta: anteNatalCares.meta,
    });

    response.code(200);
    return response;
  }
}

module.exports = AnteNatalCareHandler;
