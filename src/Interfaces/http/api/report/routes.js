const routes = (handler) => [
  {
    method: "GET",
    path: "/api/v1/reports/calculate/{reportType}",
    handler: handler.calculateReportHandler,
  },
  {
    method: "GET",
    path: "/api/v1/reports",
    handler: handler.getReportHandler,
  },
  {
    method: "POST",
    path: "/api/v1/reports",
    handler: handler.addReportHandler,
  },
  {
    method: "PATCH",
    path: "/api/v1/reports/{id}/status",
    handler: handler.updateReportHandler,
  },
];

module.exports = routes;
