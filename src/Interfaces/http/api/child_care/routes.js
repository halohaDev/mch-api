const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/child_cares",
    handler: handler.postChildCareHandler,
    options: {
      app: {
        access: ["midwife", "coordinator"],
      },
    },
  },

  {
    method: "GET",
    path: "/api/v1/child_cares",
    handler: handler.getChildCareHandler,
    options: {
      app: {
        access: ["midwife", "coordinator"],
      },
    },
  },

  {
    method: "PUT",
    path: "/api/v1/child_cares/{id}",
    handler: handler.putChildCareHandler,
    options: {
      app: {
        access: ["midwife", "coordinator"],
      },
    },
  },

  {
    method: "DELETE",
    path: "/api/v1/child_cares/{id}",
    handler: handler.deleteChildCareHandler,
    options: {
      app: {
        access: ["midwife", "coordinator"],
      },
    },
  },
];

module.exports = routes;
