const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/maternal_services/ante_natal_care",
    handler: handler.postAnteNatalCareHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
  {
    method: "POST",
    path: "/api/v1/maternal_services/post_natal_care",
    handler: handler.postPostNatalCareHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/maternal_services/maternal/{maternalId}/latest",
    handler: handler.getLatestMaternalServiceByMaternalIdHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson", "mother"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/maternal_services/maternal_history/{maternalHistoryId}/latest",
    handler: handler.getLatestMaternalServiceByMaternalHistoryIdHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson", "mother"],
      },
    },
  },
  {
    method: "POST",
    path: "/api/v1/maternal_services/deliver_child",
    handler: handler.postDeliverChild,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
  {
    method: "POST",
    path: "/api/v1/maternal_services/complications",
    handler: handler.postMaternalComplicationHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator"],
      },
    },
  },
];

module.exports = routes;
