const AddAnteNatalUseCase = require("../../../../Applications/use_case/ante_natal/AddUseCase");

class AddAnteNatalUseCase {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const authUseCase = this._container.getInstance(AddAnteNatalUseCase.name);
    const result = await authUseCase.login(request.payload);

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

module.exports = AuthHandler;
