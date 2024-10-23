const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../../db/models");
const bcrypt = require("bcrypt");
const moment = require("moment");
var jwt = require("jsonwebtoken");
const { status, common, enums, dbCommon, messages } = require("../../../utils");
const path = require("path");
const { createUser, updateUser } = require("./service");

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
