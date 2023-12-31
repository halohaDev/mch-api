const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/v1/maternal',
    handler: handler.postMaternalHandler,
  },
  {
    method: 'POST',
    path: '/api/v1/maternal/user',
    handler: handler.postMaternalUserHandler,
  },
];

module.exports = routes;
