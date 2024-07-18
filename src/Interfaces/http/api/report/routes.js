const routes = (handler) => [
  {
    method: "GET",
    path: "/api/v1/reports/calculate/{reportType}",
    handler: handler.calculateReportHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
  {
    method: "GET",
    path: "/api/v1/reports",
    handler: handler.getReportHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
  {
    method: "POST",
    path: "/api/v1/reports",
    handler: handler.addReportHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
  {
    method: "PATCH",
    path: "/api/v1/reports/{id}/status",
    handler: handler.updateReportHandler,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
  {
    method: "POST",
    path: "/api/v1/reports/calculate/jorong/{jorongId}",
    handler: handler.calculateReportJorongMonthly,
    options: {
      app: {
        access: ["admin", "midwife", "coordinator", "chairperson"],
      },
    },
  },
];

module.exports = routes;
