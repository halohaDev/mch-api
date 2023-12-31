const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/users',
    handler: handler.postUserHandler,
  },
]);

module.exports = routes;
