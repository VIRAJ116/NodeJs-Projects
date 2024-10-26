const router = require("express").Router();
const auth = require("../../middlewares/middleware");
const controller = require("./lib/controller");
const {
  validationRules,
  loginRules,
  updateRules,
  updatePassword,
  updateProfileRules,
  ForgotPasswordLink,
  updatePasswordForUser,
  updateEmail,
  emailValidation,
} = require("./lib/validation");
