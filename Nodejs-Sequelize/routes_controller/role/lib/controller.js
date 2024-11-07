const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../../db/models");
const { status, common, enums, dbCommon, messages } = require("../../../utils");

// create a role
exports.create = async (req, res) => {
  try {
    if (req.body.name) {
      const uniqueFields = {
        model: db.Role.name,
        exclude: [],
        fields: [
          {
            field: "name",
            value: req.body.name.toLowerCase(),
            name: "Name",
          },
        ],
      };
      const response = await dbCommon.checkUniqueFields(uniqueFields);
      if (response && response.status != status.OK) {
        return res
          .status(status.BadRequest)
          .json({
            message:
              messages.ROLE_ALREADY_EXISTS || "Some fields already exists.",
            fields: response?.fields,
          });
      }
    }
  } catch (error) {}
};
