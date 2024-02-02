const ReporHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "report",
  register: async (server, { container }) => {
    const reportHandler = new ReporHandler(container);
    server.route(routes(reportHandler));
  },
};
