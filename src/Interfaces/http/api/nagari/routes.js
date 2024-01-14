const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/nagari',
    handler: handler.postNagariHandler,
  },
]);

module.exports = routes;
