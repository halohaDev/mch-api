const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/jorong',
    handler: handler.postJorongHandler,
  },
]);

module.exports = routes;
