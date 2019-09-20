const router = require("express").Router();
const home = require("./api.home.controller");

router.route("/").get(home.home());

module.exports = router;
