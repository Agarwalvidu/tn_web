const jwt = require("jsonwebtoken");
const Mentor = require("../models/Mentor");

const protect = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ error: "No token, access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.mentor = await Mentor.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
};

module.exports = protect;