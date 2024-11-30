const { verifyToken } = require("../services/jwtService");

function session() {
  return function (req, res, next) {
    const token = req.cookies.token;

    if (token) {
      try {
        const sessionData = verifyToken(token);
        req.user = { username: sessionData.username, id: sessionData.id };
        res.locals.hasUser = true;
      } catch (error) {
        res.clearCookie("token");
        res.locals.hasUser = false;
      }
    } else {
      res.locals.hasUser = false;
    }
    next();
  };
}

module.exports = session;

