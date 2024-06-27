const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/v1/maternal_services/ante_natal_care',
    handler: handler.postAnteNatalCareHandler,
    options: {
      app: {
        access: ['admin', 'midwife', 'coordinator'],
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/maternal_services/maternal/{maternalId}/latest',
    handler: handler.getLatestMaternalServiceByMaternalIdHandler,
    options: {
      app: {
        access: ['admin', 'midwife', 'coordinator', 'chairperson', 'mother'],
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/maternal_services/maternal_history/{maternalHistoryId}/latest',
    handler: handler.getLatestMaternalServiceByMaternalHistoryIdHandler,
    options: {
      app: {
        access: ['admin', 'midwife', 'coordinator', 'chairperson', 'mother'],
      },
    },
  }
];

module.exports = routes;
