const PlacementUseCase = require('../../../../Applications/use_case/PlacementUseCase');

class PlacementHandler {
  constructor(container) {
    this._container = container;

    this.postPlacementHandler = this.postPlacementHandler.bind(this);
  }

  async postPlacementHandler(request, h) {
    const placementUseCase = this._container.getInstance(PlacementUseCase.name);
    const createdPlacement = await placementUseCase.addPlacement(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        ...createdPlacement,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = PlacementHandler;
