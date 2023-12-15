const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTION") {
    console.log("Option Method");
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorised" });
    }
    const decode = jwt.verify(token, config.get("jwtSecret"));

    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorised" });
    console.log(error);
  }
};
