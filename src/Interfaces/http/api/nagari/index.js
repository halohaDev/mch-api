const NagariHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'nagari',
  register: async (server, { container }) => {
    const nagariHandler = new NagariHandler(container);
    server.route(routes(nagariHandler));
  },
};