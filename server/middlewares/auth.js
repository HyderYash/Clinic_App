const jwt = require("jsonwebtoken");
const HelperFun = require("../helpers/helperFun");
const hf = new HelperFun();

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const isUserExist = await hf.checkIfUserExistsInDB(user.ID);
      if (isUserExist === true) {
        next();
      } else {
        res.status(401).json({
          title: "Invalid Payload",
          detail: "The Payload token you provided is invalid.",
        });
      }
    } catch (error) {
      res.status(401).json({
        title: "Invalid Authorization Token",
        detail: "The Authorization token you provided is invalid or expired.",
        error,
      });
    }
  }
  if (!token) {
    res.status(401).json({
      title: "Missing Authorization Token",
      detail: "No API Authorization Token provided.",
    });
  }
};

module.exports = { protect };
