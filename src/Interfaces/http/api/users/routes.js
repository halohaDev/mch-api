const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/users",
    handler: handler.postUserHandler,
    options: {
      app: {
        access: ["admin"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/users",
    handler: handler.getUsersHandler,
    options: {
      app: {
        access: ["admin"],
      },
    },
  },
];

module.exports = routes;
