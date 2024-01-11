const AnteNatalCareHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "ante_natal",
  register: async (server, { container }) => {
    const handler = new AnteNatalCareHandler(container);
    server.route(routes(handler));
  },
};
