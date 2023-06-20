const routes = (handler) => ([
  {
    method: 'POST',
    path: '/nagari',
    handler: handler.postNagariHandler,
  },
]);

module.exports = routes;
