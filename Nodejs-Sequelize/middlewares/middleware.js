var jwt = require("jsonwebtoken");
const db = require("../db/models");
const { status, messages } = require("../utils");

const authenticateUser = async (req, res, next) => {
  try {
    var token = req.headers.authorization || null;
    if (!token) {
      return res.status(status.Unauthorized).json({
        message: messages.unauthorized,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(status.Unauthorized)
        .json({ message: messages.unauthorized });
    }
    const user = await db.User.scope("withPassword").findOne({
      attributes: {
        exclude: [
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
          "deletedAt",
          "deletedBy",
        ],
        where: { id: decoded.id, deletedAt: null },
        include: [
          {
            model: db.Role,
            as: "Role",
            attributes: ["id", "name", "isSystemAdmin", "isAdmin", "level"],
            where: {
              deletedAt: null,
            },
          },
        ],
      },
    });
    if (!user) {
      return res.status(status.Unauthorized).json({
        message: messages.unauthorized,
      });
    }
    req.user = user;
    return next();
  } catch (err) {
    console.error("Admin Middleware", err.message);
    return res
      .status(status.Unauthorized)
      .json({ message: messages.unauthorized });
  }
};

module.exports = authenticateUser;
