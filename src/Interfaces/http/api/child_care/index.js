const ChildCareHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "child_care",
  register: async (server, { container }) => {
    const childCareHandler = new ChildCareHandler(container);
    server.route(routes(childCareHandler));
  },
};
