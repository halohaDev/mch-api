const routes = (handler) => [
  {
    method: "GET",
    path: "/api/v1/childs",
    handler: handler.getChildHandler,
    options: {
      app: {
        access: ["midwife", "coordinator"],
      },
    },
  },
];

module.exports = routes;
