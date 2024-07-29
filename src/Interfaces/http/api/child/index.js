const ChildHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "childs",
  register: async (server, { container }) => {
    const childHandler = new ChildHandler(container);
    server.route(routes(childHandler));
  },
};
