const routes = (handler) => ([
  {
    method: 'POST',
    path: '/placements',
    handler: handler.postPlacementHandler,
  },
]);

module.exports = routes;
