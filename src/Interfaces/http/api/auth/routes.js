const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/login",
    handler: handler.postAuthenticationHandler,
    options: {
      app: {
        access: ["public"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/auth",
    handler: handler.getAuthenticationHandler,
    options: {
      app: {
        access: ["admin", "midwife", "mother", "chairperson"],
      },
    },
  },
];

module.exports = routes;
