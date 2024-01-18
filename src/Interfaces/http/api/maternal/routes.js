const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/maternals",
    handler: handler.postMaternalHandler,
  },
  {
    method: "POST",
    path: "/api/v1/maternals/user",
    handler: handler.postMaternalUserHandler,
  },
  {
    method: "GET",
    path: "/api/v1/maternals",
    handler: handler.getMaternalHandler,
  },
];

module.exports = routes;
