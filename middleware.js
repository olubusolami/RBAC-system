const jwt = require("jsonwebtoken");
const config = process.env;


const generateToken = async (payload) => {
  try {
    const token = jwt.sign(JSON.stringify(payload), config.TOKEN_SECRET);
    if (token) return { token };
  } catch (error) {
    return { error };
  }
};

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(400).json({ error: "Auhtorization empty" });
  token = token.split(" ")[1];

  if (!token) {
    return res.status(403).send("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    res.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const isNotBasic = async (req, res, next) => {
  if (res.user.role == "basic") {
    return res.status(401).json({ message: "You are a basic User, no authorized permission" });
  } else {
    return next();
  }
};

const isAdmin = async (req, res, next) => {
  if (res.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    return next();
  }
};

module.exports = {
    generateToken,
    verifyToken,
    isNotBasic,
    isAdmin
  };