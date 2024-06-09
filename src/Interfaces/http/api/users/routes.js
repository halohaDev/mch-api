const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/users",
    handler: handler.postUserHandler,
    options: {
      app: {
        access: ["public"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/users",
    handler: handler.getUsersHandler,
    options: {
      app: {
        access: ["public"],
      },
    },
  },
  {
    method: "PUT",
    path: "/api/v1/users/{id}",
    handler: handler.putUserByIdHandler,
    options: {
      app: {
        access: ["public"],
      },
    },
  }
];

module.exports = routes;
