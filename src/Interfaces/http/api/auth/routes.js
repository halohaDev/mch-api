const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/login',
    handler: handler.postAuthenticationHandler,
  },
]);

module.exports = routes;
