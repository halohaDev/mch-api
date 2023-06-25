const routes = (handler) => [
  {
    method: 'POST',
    path: '/maternal',
    handler: handler.postMaternalHandler,
  },
  {
    method: 'POST',
    path: '/maternal/user',
    handler: handler.postMaternalUserHandler,
  },
];

module.exports = routes;
