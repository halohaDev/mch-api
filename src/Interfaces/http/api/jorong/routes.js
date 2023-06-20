const routes = (handler) => ([
  {
    method: 'POST',
    path: '/jorong',
    handler: handler.postJorongHandler,
  },
]);

module.exports = routes;
