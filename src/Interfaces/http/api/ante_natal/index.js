const AnteNatalCareHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "ante_natal",
  register: async (server, { container }) => {
    const ancHandler = new AnteNatalCareHandler(container);
    server.route(routes(ancHandler));
  },
};
