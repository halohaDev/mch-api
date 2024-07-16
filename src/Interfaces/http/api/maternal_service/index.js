const MaternalServiceHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'maternal_service',
  register: async (server, { container }) => {
    const maternalServiceHandler = new MaternalServiceHandler(container);
    server.route(routes(maternalServiceHandler));
  },
};