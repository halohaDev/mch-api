const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/ante_natal_cares",
    handler: handler.postAnteNatalCareHandler,
  },
  {
    method: "GET",
    path: "/api/v1/ante_natal_cares",
    handler: handler.getAnteNatalCaresHandler,
  },
];

module.exports = routes;
