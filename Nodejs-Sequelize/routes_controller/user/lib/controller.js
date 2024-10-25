const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../../db/models");
const bcrypt = require("bcrypt");
const moment = require("moment");
var jwt = require("jsonwebtoken");
const { status, common, enums, dbCommon, messages } = require("../../../utils");
const path = require("path");
const { createUser, updateUser } = require("./service");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// login user
exports.login = async (req, res) => {
  const { transaction } = await dbCommon.startTransaction();
  try {
    const user = await db.User.scope("withPassword").findOne({
      where: {
        email: req.body.email,
        deletedAt: null,
      },
      include: [
        {
          model: db.Role,
          as: "Role",
          attributes: ["id", "name", "status"],
        },
      ],
    });
    if (!user) {
      await dbCommon.rollbackTransaction(transaction);
      return res.status(status.NotFound).json({
        message: "User does not exist.",
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      await dbCommon.rollbackTransaction(transaction);
      return res.status(status.Unauthorized).json({
        message: "Invalid Credentials!",
      });
    }
    const token = signToken(user.id);
    await dbCommon.commitTransaction(transaction);
    // 3) If everything ok, send token to client
    createSendToken(user, status.OK, res);
  } catch (err) {
    await dbCommon.rollbackTransaction(transaction);
    return common.throwException(err, "Login User", req, res);
  }
};

// create user
exports.create = async (req, res) => {
  const { transaction } = await dbCommon.startTransaction();
  try {
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      roleId: req.body.roleId,
      createdBy: req.user.id,
    };
    if (req.body.mobile) {
      const uniqueFields = {
        model: db.User.name,
        exclude: [],
        fields: [
          {
            field: "mobile",
            value: req.body.mobile,
            name: "Mobile",
          },
        ],
      };
      const response = await dbCommon.checkUniqueFields(uniqueFields);
      if (response && response.status != status.OK) {
        return res.status(status.BadRequest).json({
          message: response?.message || "Some fields already exists.",
          fields: response?.fields,
        });
      }
    }
    await createUser(userData, transaction, req);
    await dbCommon.commitTransaction(transaction);
    return res
      .status(status.OK)
      .json({ message: "User Created Successfully." });
  } catch (err) {
    return common.throwException(err, "Create User", req, res);
  }
};

// update user
exports.update = async (req, res) => {
  const { transaction } = await dbCommon.startTransaction();
  try {
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
      email: req.body.email.toLowerCase(),
      roleId: req.body.roleId,
      updatedBy: req.user.id,
    };
    if (req.body.mobile) {
      const uniqueFields = {
        model: db.User.name,
        exclude: [req.params.id],
        fields: [
          {
            field: "mobile",
            value: req.body.mobile,
            name: "Mobile",
          },
        ],
      };

      const response = await dbCommon.checkUniqueFields(uniqueFields);

      if (response && response.status != status.OK) {
        return res.status(status.BadRequest).json({
          message: response?.message || "Some fields already exists.",
          fields: response?.fields,
        });
      }
    }
    var whereCondition = {};
    if (!req.user.Role.isSystemAdmin) {
      whereCondition.isAdmin = false;
      whereCondition.level = { [Op.gt]: req.user.Role.level };
    }
    const user = await db.User.findOne({
      where: {
        deletedAt: null,
        id: req.params.id,
      },
      include: [
        {
          model: db.Role,
          as: "Role",
          attributes: ["id", "name"],
          where: {
            isSystemAdmin: false,
            ...whereCondition,
          },
        },
      ],
    });
    if (!user) {
      return res.status(status.NotFound).json({ message: "User not found." });
    }
    await updateUser(userData, transaction, user);
    await dbCommon.commitTransaction(transaction);
    return res.status(status.OK).json({
      message: "User updated successfully.",
    });
  } catch (err) {
    return common.throwException(err, "Update User", req, res);
  }
};

// find user by id
exports.findById = async (req, res) => {
  try {
    let whereCondition = {};
    if (!req.user.Role.isSystemAdmin) {
      whereCondition.isAdmin = false;
      whereCondition.level = { [Op.gt]: req.user.Role.level };
    }
    const user = await db.User.findOne({
      where: {
        id: req.params.id,
        deletedAt: null,
      },
      include: [
        {
          model: db.Role,
          as: "Role",
          attributes: ["id", "name"],
          where: {
            isSystemAdmin: false,
            ...whereCondition,
          },
        },
        {
          model: db.User,
          as: "CreatedByUser",
          attributes: ["id", "firstName", "lastName", "fullName"],
        },
        {
          model: db.User,
          as: "UpdatedByUser",
          attributes: ["id", "firstName", "lastName", "fullName"],
        },
      ],
    });
    if (!user) {
      return res.status(status.NotFound).json({ message: "User not found." });
    }
    return res.status(status.OK).json({ data: user });
  } catch (err) {
    return common.throwException(err, "Get User By Id", req, res);
  }
};
