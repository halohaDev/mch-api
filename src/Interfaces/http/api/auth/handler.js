const AuthUseCase = require("../../../../Applications/use_case/AuthUseCase");

class AuthHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.getAuthenticationHandler = this.getAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    const { userId, ...result } = await authUseCase.login(request.payload);
    const user = await authUseCase.showAuthenticatedUser({ userId });

    const response = h.response({
      status: "success",
      data: {
        ...result,
        user,
      },
    });

    response.code(201);
    return response;
  }

  async getAuthenticationHandler(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    const { id } = request.auth.credentials;
    const result = await authUseCase.showAuthenticatedUser({ userId: id });

    const response = h.response({
      status: "success",
      data: {
        ...result,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = AuthHandler;
