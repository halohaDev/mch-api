const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/users",
    handler: handler.postUserHandler,
    options: {
      app: {
        access: ["admin", "chairperson"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/users",
    handler: handler.getUsersHandler,
    options: {
      app: {
        access: ["admin", "chairperson"],
      },
    },
  },
  {
    method: "PUT",
    path: "/api/v1/users/{id}",
    handler: handler.putUserByIdHandler,
    options: {
      app: {
        access: ["admin", "chairperson"],
      },
    },
  }
];

module.exports = routes;
