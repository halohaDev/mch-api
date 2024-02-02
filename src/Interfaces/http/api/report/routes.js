const routes = (handler) => [
  {
    method: "GET",
    path: "/api/v1/reports/calculate/{reportType}",
    handler: handler.calculateReportHandler,
  },
];

module.exports = routes;
