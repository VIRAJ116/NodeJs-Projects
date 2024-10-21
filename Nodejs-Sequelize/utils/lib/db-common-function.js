const db = require("../../db/models");
const enums = require("./enums");
const { status } = require("./messages/api.response");
const common = require("./common-function");
const { Op } = require("sequelize");

module.exports = {
  async startTransaction() {
    const transaction = await db.sequelize.transaction();
    return { transaction };
  },
  async commitTransaction(transaction) {
    await transaction.commit();

    return true;
  },
  async rollbackTransaction(transaction, session) {
    try {
      await transaction.rollback();

      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      return false;
    }
  },
  async getPermissionByToken(user) {
    try {
      let permissions = [];
      if (user?.Role?.isSystemAdmin) {
        permissions = await db.Module.findAll({
          attributes: [["id", "moduleId"]],
          // raw: true,
        });
      } else {
        permissions = await db.Permission.findAll({
          attributes: ["moduleId"],
          where: {
            roleId: user.roleId,
          },
          include: [
            {
              model: db.Module,
              as: "Module",
              attributes: [],
              where: {
                status: enums.Status.Active,
              },
            },
          ],
          // raw: true,
        });
      }

      permissions = JSON.parse(JSON.stringify(permissions));
      const moduleIds = permissions.map((i) => i.moduleId);
      return moduleIds;
    } catch (err) {
      Promise.reject(err);
    }
  },
  async checkUniqueFields(input) {
    try {
      let whereCondition = {};

      const fieldObj = {};

      input.fields.forEach((m1) => {
        fieldObj[m1.field] = m1.value;
      });
      whereCondition = {
        [Op.or]: fieldObj,
      };

      if (input.whereCondition && input.whereCondition.length > 0) {
        input.whereCondition.forEach((m1) => {
          whereCondition[m1.field] = m1.value;
        });
      }

      if (input?.exclude) {
        whereCondition.id = {
          [Op.notIn]: input.exclude,
        };
      }

      const response = await db[input.model].findOne({
        where: {
          deletedAt: null,
          ...whereCondition,
        },
        raw: true,
      });

      if (response) {
        let notUnique = [];
        let errorFields = [];
        input.fields.forEach((m1) => {
          if (m1.value == response[m1.field].toLowerCase()) {
            notUnique.push(m1.name);
            errorFields.push({
              type: "field",
              value: m1.value,
              msg: m1.name + " already in use.",
              path: m1.field,
              location: "body",
            });
          }
        });

        return new Object({
          status: status.BadRequest,
          message: `${notUnique.join(", ")} already in use.`,
          fields: errorFields,
        });
      }
      return new Object({
        status: status.OK,
      });
    } catch (err) {
      common.throwException(err, "DB Common -> checkUniqueFields");
      return {
        status: status.BadRequest,
        message: err?.message || "Something went wrong.",
      };
    }
  },
  async checkUniqueFieldsForModule(input) {
    try {
      let whereCondition = {};

      const fieldObj = {};

      input.fields.forEach((m1) => {
        fieldObj[m1.field] = m1.value;
      });
      whereCondition = {
        [Op.or]: fieldObj,
      };

      if (input?.exclude) {
        whereCondition.id = {
          [Op.notIn]: input.exclude,
        };
      }

      const response = await db[input.model].findOne({
        where: {
          ...whereCondition,
        },
        raw: true,
      });

      if (response) {
        let notUnique = [];
        let errorFields = [];
        input.fields.forEach((m1) => {
          if (m1.value == response[m1.field].toLowerCase()) {
            notUnique.push(m1.name);
            errorFields.push({
              type: "field",
              value: m1.value,
              msg: m1.name + " already in use.",
              path: m1.field,
              location: "body",
            });
          }
        });

        return new Object({
          status: status.BadRequest,
          message: `${notUnique.join(", ")} already in use.`,
          fields: errorFields,
        });
      }
      return new Object({
        status: status.OK,
      });
    } catch (err) {
      common.throwException(err, "DB Common -> checkUniqueFields");
      return {
        status: status.BadRequest,
        message: err?.message || "Something went wrong.",
      };
    }
  },
};
