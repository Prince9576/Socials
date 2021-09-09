const jsonwebtoken = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized");
    }
    const { userId } = jsonwebtoken.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.userId = userId;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(500).send("Internal Server Error");
  }
};
