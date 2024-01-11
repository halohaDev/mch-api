const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/ante_natal_cares",
    handler: handler.postAnteNatalCareHandler,
  },
];

module.exports = routes;
