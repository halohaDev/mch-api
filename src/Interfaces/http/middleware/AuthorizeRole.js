const authorizeRoles = (roles) => {
  return (req, h) => {
    if (roles.includes("public") && !req.auth.isAuthenticated) {
      return h.continue;
    }

    const { role: userRole } = req.auth.credentials;

    if (roles.includes(userRole) || roles.includes("public")) {
      return h.continue;
    }

    return h
      .response({
        status: "fail",
        message: "You are not authorized to access this resource",
      })
      .code(403);
  };
};

module.exports = authorizeRoles;
