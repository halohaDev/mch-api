const Hapi = require("@hapi/hapi");
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");
const ClientError = require("../../Commons/exceptions/ClientError");

const users = require("../../Interfaces/http/api/users");
const auth = require("../../Interfaces/http/api/auth");
const nagari = require("../../Interfaces/http/api/nagari");
const jorong = require("../../Interfaces/http/api/jorong");
const placements = require("../../Interfaces/http/api/placements");
const maternal = require("../../Interfaces/http/api/maternal");
const anteNatalCares = require("../../Interfaces/http/api/ante_natal");

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: auth,
      options: { container },
    },
    {
      plugin: nagari,
      options: { container },
    },
    {
      plugin: jorong,
      options: { container },
    },
    {
      plugin: placements,
      options: { container },
    },
    {
      plugin: maternal,
      options: { container },
    },
    {
      plugin: anteNatalCares,
      options: { container },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
          detail: translatedError.detail,
        });

        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      newResponse.code(500);

      // eslint-disable-next-line no-console
      console.log(response.stack);

      return newResponse;
    }

    return response.continue || response;
  });

  return server;
};

module.exports = createServer;
