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
  }
];

module.exports = routes;
