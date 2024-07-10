const AddAnteNatalCareUseCase = require('../../../../Applications/use_case/ante_natal/AddAnteNatalCareUseCase');
const AddPostNatalCareUseCase = require('../../../../Applications/use_case/post_natal/AddPostNatalCareUseCase');
const MaternalServiceUseCase = require('../../../../Applications/use_case/MaternalServiceUseCase');

class MaternalServiceHandler {
  constructor(container) {
    this._container = container;

    this.postAnteNatalCareHandler = this.postAnteNatalCareHandler.bind(this);
    this.getLatestMaternalServiceByMaternalIdHandler = this.getLatestMaternalServiceByMaternalIdHandler.bind(this);
    this.getLatestMaternalServiceByMaternalHistoryIdHandler = this.getLatestMaternalServiceByMaternalHistoryIdHandler.bind(this);
    this.postPostNatalCareHandler = this.postPostNatalCareHandler.bind(this);
  }

  async postAnteNatalCareHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const payload = {
      ...request.payload,
      midwifeId: userId,
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

   async postPostNatalCareHandler(request, h) {
      const { id: userId } = request.auth.credentials;
      const payload = {
        ...request.payload,
        midwifeId: userId,
      };
      
      const addPostNatalCareUseCase = this._container.getInstance(AddPostNatalCareUseCase.name);
      const addedPostNatalCare = await addPostNatalCareUseCase.execute(payload);

      const response = h.response({
        status: 'success',
        data: {
          ...addedPostNatalCare,
        },
      });

      response.code(201);
      return response;
    }

  async getLatestMaternalServiceByMaternalIdHandler(request, h) {
    const { maternalId } = request.params;
    const maternalServiceUseCase = this._container.getInstance(MaternalServiceUseCase.name);

    const currentAuth = request.auth.credentials;
    const latestMaternalService = await maternalServiceUseCase.getLastServiceByMaternalId(maternalId, currentAuth);

    const response = h.response({
      status: 'success',
      data: {
        ...latestMaternalService,
      },
    });

    return response;
  }

  async getLatestMaternalServiceByMaternalHistoryIdHandler(request, h) {
    const { maternalHistoryId } = request.params;
    const maternalServiceUseCase = this._container.getInstance(MaternalServiceUseCase.name);

    const currentAuth = request.auth.credentials;
    const latestMaternalService = await maternalServiceUseCase.getLastMaternalServiceByMaternalHistoryId(maternalHistoryId, currentAuth);

    const response = h.response({
      status: 'success',
      data: {
        ...latestMaternalService,
      },
    });

    return response;
  }
}

module.exports = MaternalServiceHandler;
