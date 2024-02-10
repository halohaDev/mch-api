const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/ante_natal_cares",
    handler: handler.postAnteNatalCareHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/ante_natal_cares",
    handler: handler.getAnteNatalCaresHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
];

module.exports = routes;
