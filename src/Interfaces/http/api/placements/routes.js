const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/placements",
    handler: handler.postPlacementHandler,
    options: {
      app: {
        access: ["admin", "coordinator", "chairperson"],
      },
    },
  },
];

module.exports = routes;
