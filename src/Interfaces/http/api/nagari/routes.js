const routes = (handler) => [
  {
    method: "POST",
    path: "/api/v1/nagari",
    handler: handler.postNagariHandler,
    options: {
      auth: "mch-api-jwt",
      pre: [
        
    },
  },
];

module.exports = routes;
