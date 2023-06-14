const AuthUseCase = require('../../../../Applications/use_case/AuthUseCase');

class AuthHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    const result = await authUseCase.login(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        ...result,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = AuthHandler;
