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
];

module.exports = routes;
