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
  {
    method: "GET",
    path: "/api/v1/placements/{midwifeId}",
    handler: handler.getPlacementByMidwifeIdHandler,
    options: {
      app: {
        access: ["admin", "coordinator", "chairperson", "midwife"],
      },
    },
  }
];

module.exports = routes;
