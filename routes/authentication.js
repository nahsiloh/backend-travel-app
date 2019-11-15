const jwt = require("jsonwebtoken");

const protectedRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You need a travel ticket!");
    }
    req.user = jwt.verify(req.cookies.token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).end("You are not authorised");
  }
};

module.exports = protectedRoute;
