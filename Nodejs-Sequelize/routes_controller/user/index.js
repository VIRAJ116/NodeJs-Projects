const router = require("express").Router();
const auth = require("../../middlewares/middleware");
const controller = require("./lib/controller");
const {
  validationRules,
  loginRules,
  updateRules,
} = require("./lib/validation");

const { expressValidate } = require("../../utils/lib/common-function");

// Get all User
router.get("/user", auth, controller.findAll);

// Get user options
router.get("/user/options", auth, controller.userOptions);

// Get User by Id
router.get("/user/:id", auth, controller.findById);

// Create User
router.post(
  "/user",
  auth,
  validationRules(),
  expressValidate,
  controller.create
);

// login
router.post("/login", loginRules(), expressValidate, controller.login);

// Update user
router.put(
  "/user/:id",
  auth,
  updateRules(),
  expressValidate,
  controller.update
);

// delete user
router.delete("user/:id", auth, controller.delete);

module.exports = router;
