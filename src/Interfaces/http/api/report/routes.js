const routes = (handler) => [
  {
    method: "GET",
    path: "/api/v1/report/calculate/{reportType}",
    handler: handler.calculateReportHandler,
  },
];

module.exports = routes;
