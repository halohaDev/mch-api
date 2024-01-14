const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/placements',
    handler: handler.postPlacementHandler,
  },
]);

module.exports = routes;
