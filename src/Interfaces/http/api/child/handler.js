const ChildUseCase = require("../../../../Applications/use_case/ChildUseCase");

class ChildCareHandler {
  constructor(container) {
    this._container = container;

    this.getChildHandler = this.getChildHandler.bind(this);
  }

  async getChildHandler(request, h) {
    const childUseCase = this._container.getInstance(ChildUseCase.name);

    const children = await childUseCase.showChildUseCase(request.query);

    return {
      status: "success",
      data: children.data,
      meta: children.meta,
    };
  }
}

module.exports = ChildCareHandler;
