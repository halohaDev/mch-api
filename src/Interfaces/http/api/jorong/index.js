const JorongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'jorong',
  register: async (server, { container }) => {
    const jorongHandler = new JorongHandler(container);
    server.route(routes(jorongHandler));
  },
};