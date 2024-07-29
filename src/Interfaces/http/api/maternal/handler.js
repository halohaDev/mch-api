const MaternalUseCase = require("../../../../Applications/use_case/MaternalUseCase");
const MaternalHistoryUseCase = require("../../../../Applications/use_case/MaternalHistoryUseCase");

class MaternalHandler {
  constructor(container) {
    this._container = container;
    this.postMaternalHandler = this.postMaternalHandler.bind(this);
    this.postMaternalUserHandler = this.postMaternalUserHandler.bind(this);
    this.getMaternalHandler = this.getMaternalHandler.bind(this);
    this.getMaternalByIdHandler = this.getMaternalByIdHandler.bind(this);
    this.getMaternalHistoryByMaternalIdHandler = this.getMaternalHistoryByMaternalIdHandler.bind(this);
    this.getMaternalHistoryByIdHandler = this.getMaternalHistoryByIdHandler.bind(this);
  }

  async postMaternalHandler(request, h) {
    const maternalUseCase = this._container.getInstance(MaternalUseCase.name);
    const createdMaternal = await maternalUseCase.addMaternal(request.payload);

    const response = h.response({
      status: "success",
      data: {
        ...createdMaternal,
      },
    });

    response.code(201);
    return response;
  }

  async postMaternalUserHandler(request, h) {
    const maternalUseCase = this._container.getInstance(MaternalUseCase.name);
    const createdMaternal = await maternalUseCase.addUserMaternal(request.payload);

    const response = h.response({
      status: "success",
      data: {
        ...createdMaternal,
      },
    });

    response.code(201);
    return response;
  }

  async getMaternalHandler(request, h) {
    const maternalUseCase = this._container.getInstance(MaternalUseCase.name);

    const maternals = await maternalUseCase.showAllMaternal(request.query);

    return {
      status: "success",
      data: maternals.data,
      meta: maternals.meta,
    };
  }

  async getMaternalByIdHandler(request, h) {
    const maternalUseCase = this._container.getInstance(MaternalUseCase.name);

    const result = await maternalUseCase.getMaternalUserById(request.params.id);

    return {
      status: "success",
      data: {
        ...result,
      },
    };
  }

  async getMaternalHistoryByMaternalIdHandler(request, h) {
    const maternalHistoryUseCase = this._container.getInstance(MaternalHistoryUseCase.name);

    const currentAuth = request.auth.credentials;
    const result = await maternalHistoryUseCase.showMaternalHistoryByMaternalId(request.params.id, currentAuth);

    return {
      status: "success",
      data: result,
    };
  }

  async getMaternalHistoryByIdHandler(request, h) {
    const maternalHistoryUseCase = this._container.getInstance(MaternalHistoryUseCase.name);

    const currentAuth = request.auth.credentials;
    const result = await maternalHistoryUseCase.showMaternalHistoryById(
      request.params.maternalId,
      request.params.maternalHistoryId,
      currentAuth
    );

    return {
      status: "success",
      data: result,
    };
  }
}

module.exports = MaternalHandler;
