const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersHandler,
  },
]);

module.exports = routes;
