const MaternalHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'maternal',
  register: async (server, { container }) => {
    const maternalHandler = new MaternalHandler(container);
    server.route(routes(maternalHandler));
  },
};