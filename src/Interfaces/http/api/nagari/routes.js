const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/nagari",
    handler: handler.postNagariHandler,
    options: {
      app: {
        access: ["admin"],
      },
    },
  },
];

module.exports = routes;
