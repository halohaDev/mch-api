const PlacementHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'placements',
  register: async (server, { container }) => {
    const placementHandler = new PlacementHandler(container);
    server.route(routes(placementHandler));
  },
};