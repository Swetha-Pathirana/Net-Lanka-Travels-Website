const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const SuperAdmin = require("../models/SuperAdmin");

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role and attach user object accordingly
    if (decoded.role === "superadmin") {
      req.admin = await SuperAdmin.findById(decoded.id).select("-password");
    } else {
      req.admin = await Admin.findById(decoded.id).select("-password");
    }

    if (!req.admin) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminAuth;
