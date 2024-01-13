const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/maternal",
    handler: handler.postMaternalHandler,
  },
  {
    method: "POST",
    path: "/api/v1/maternal/user",
    handler: handler.postMaternalUserHandler,
  },
  {
    method: "GET",
    path: "/api/v1/maternal",
    handler: handler.getMaternalHandler,
  },
];

module.exports = routes;
