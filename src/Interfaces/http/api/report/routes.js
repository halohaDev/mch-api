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
];

module.exports = routes;
