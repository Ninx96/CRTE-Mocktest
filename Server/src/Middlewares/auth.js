var jwt = require("jsonwebtoken");
const config = require("config");

const secret = config.get("secret");

//Auth token check

const auth = (req, res, next) => {
  var token = req.header("auth-token");

  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    var decoded = jwt.verify(token, process.env.secret || secret);
    res.locals = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token !");
  }
};

module.exports = auth;
