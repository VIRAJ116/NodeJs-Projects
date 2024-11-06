const { body } = require("express-validator");
const db = require("../../../db/models");
const { Op, where } = require("sequelize");
const User = db.User;
const Role = db.Role;

const loginRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter valid email."),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const validationRules = () => {
  return [
    body("firstName").notEmpty().trim().withMessage("First Name is required."),
    body("lastName").notEmpty().trim().withMessage("Last Name is required."),
    body("mobile")
      .notEmpty()
      .trim()
      .withMessage("Mobile is required")
      .isLength({ min: 7, max: 15 })
      .withMessage("Enter a valid Mobile Number"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (value) => {
        try {
          const user = await User.findOne({
            where: {
              email: value?.toLowerCase(),
            },
          });
          if (user) {
            return Promise.reject("Email already in use.");
          }
          return true;
        } catch (err) {
          return Promise.reject("Something went wrong");
        }
      }),
    body("password")
      .notEmpty()
      .withMessage("Password is required field")
      .isLength({ min: 8 })
      .withMessage("Minimum 8 characters is required"),
    body("roleId")
      .notEmpty()
      .trim()
      .withMessage("Role is required")
      .custom(async (value, { req }) => {
        try {
          const Role = await Role.findOne({
            where: {
              id: value,
              deletedAt: null,
              level: { [Op.lte]: req.user.Role.level },
            },
          });
        } catch (err) {
          return Promise.reject("Something went wrong");
        }
      }),
  ];
};

const updateRules = () => {
  return [
    body("firstName").notEmpty().trim().withMessage("First Name is required."),
    body("lastName").notEmpty().trim().withMessage("Last Name is required."),
    body("mobile")
      .notEmpty()
      .trim()
      .withMessage("Mobile is required.")
      .isLength({ min: 7, max: 15 })
      .withMessage("Enter a valid Mobile Number."),
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({
            where: {
              id: {
                id: { [Op.ne]: req.params.id },
                email: value?.toLowerCase(),
              },
            },
          });
          if (user) {
            return Promise.reject("Email already in use.");
          }
          return true;
        } catch (err) {
          return Promise.reject("Something went wrong!");
        }
      }),
    body("roleId").notEmpty().trim().withMessage("Role is required."),
  ];
};

const emailValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Enter a valid email"),
  ];
};

module.exports = {
  loginRules,
  validationRules,
  emailValidation,
  updateRules,
};
