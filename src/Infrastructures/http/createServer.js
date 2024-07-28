const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");
const ClientError = require("../../Commons/exceptions/ClientError");

const users = require("../../Interfaces/http/api/users");
const auth = require("../../Interfaces/http/api/auth");
const nagari = require("../../Interfaces/http/api/nagari");
const jorong = require("../../Interfaces/http/api/jorong");
const placements = require("../../Interfaces/http/api/placements");
const maternal = require("../../Interfaces/http/api/maternal");
const anteNatalCares = require("../../Interfaces/http/api/ante_natal");
const report = require("../../Interfaces/http/api/report");
const maternalService = require("../../Interfaces/http/api/maternal_service");
const childCare = require("../../Interfaces/http/api/child_care");
const child = require("../../Interfaces/http/api/child");

const createServer = async (container, tracker = null) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([{ plugin: Jwt }]);

  server.auth.strategy("mch-api-jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => {
      const { userId, role } = artifacts.decoded.payload;

      return {
        isValid: true,
        credentials: { id: userId, role: role },
      };
    },
  });

  server.auth.default({ strategy: "mch-api-jwt", mode: "try" });

  server.ext("onPreHandler", (request, h) => {
    const roleAccess = request.route.settings.app.access;

    if (!roleAccess) {
      return h.continue;
    }

    if (roleAccess.includes("public") && !request.auth.isAuthenticated) {
      return h.continue;
    }

    if (!request.auth.isAuthenticated) {
      return h
        .response({
          status: "fail",
          message: "You are not authenticated",
        })
        .code(401)
        .takeover();
    }

    const { role: userRole } = request.auth.credentials;

    if (roleAccess.includes(userRole) || roleAccess.includes("public")) {
      return h.continue;
    }

    return h
      .response({
        status: "fail",
        message: "You are not authorized to access this resource",
      })
      .code(403)
      .takeover();
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
    {
      plugin: report,
      options: { container },
    },
    {
      plugin: maternalService,
      options: { container },
    },
    {
      plugin: childCare,
      options: { container },
    },
    {
      plugin: child,
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

      console.log(response.stack);
      tracker?.captureException(response);

      return newResponse;
    }

    return response.continue || response;
  });

  return server;
};

module.exports = createServer;
