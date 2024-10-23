const router = require("express").Router();

router.use("/", require("./user"));
// router.use("/", require("./role"));
// router.use("/", require("./permission"));

module.exports = router;
