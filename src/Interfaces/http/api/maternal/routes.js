const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/maternals",
    handler: handler.postMaternalHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
  {
    method: "POST",
    path: "/api/v1/maternals/user",
    handler: handler.postMaternalUserHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/maternals",
    handler: handler.getMaternalHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/maternals/{id}",
    handler: handler.getMaternalByIdHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/maternals/{id}/histories",
    handler: handler.getMaternalHistoryByMaternalIdHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson", "mother"],
      },
    },
  },
];

module.exports = routes;
