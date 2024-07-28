const ChildCareUseCase = require("../../../../Applications/use_case/ChildCareUseCase");

class ChildCareHandler {
  constructor(container) {
    this._container = container;

    this.postChildCareHandler = this.postChildCareHandler.bind(this);
    this.getChildCareHandler = this.getChildCareHandler.bind(this);
    this.putChildCareHandler = this.putChildCareHandler.bind(this);
    this.deleteChildCareHandler = this.deleteChildCareHandler.bind(this);
  }

  async postChildCareHandler(request, h) {
    const childCareUseCase = this._container.getInstance(ChildCareUseCase.name);
    const createdChildCare = await childCareUseCase.createChildCare(request.payload);

    const response = h.response({
      status: "success",
      data: {
        ...createdChildCare,
      },
    });

    response.code(201);
    return response;
  }

  async getChildCareHandler(request, h) {
    const childCareUseCase = this._container.getInstance(ChildCareUseCase.name);

    const childCares = await childCareUseCase.showChildCares(request.query);

    return {
      status: "success",
      data: childCares.data,
      meta: childCares.meta,
    };
  }

  async putChildCareHandler(request, h) {
    const childCareUseCase = this._container.getInstance(ChildCareUseCase.name);
    await childCareUseCase.updateChildCare(request.params.id, request.payload);

    return {
      status: "success",
    };
  }

  async deleteChildCareHandler(request, h) {
    const childCareUseCase = this._container.getInstance(ChildCareUseCase.name);
    await childCareUseCase.deleteChildCare(request.params.id);

    return {
      status: "success",
    };
  }
}

module.exports = ChildCareHandler;
