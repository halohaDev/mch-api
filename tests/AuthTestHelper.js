const JsonWebToken = require("../src/Infrastructures/security/JsonWebToken");
const jwt = require("@hapi/jwt");

// create test helper for easier authentication to get token
const authenticateUser = async (id, role) => {
  const token = new JsonWebToken(jwt.token);
  return await token.createAccessToken({ userId: id, role });
};

module.exports = { authenticateUser };
