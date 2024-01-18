require("dotenv").config();
const createServer = require("./Infrastructures/http/createServer");
const container = require("./Infrastructures/container");
const Sentry = require("./Infrastructures/sentry");

const init = async () => {
  const server = await createServer(container, Sentry);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
