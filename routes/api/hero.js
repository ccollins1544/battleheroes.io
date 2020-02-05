const router = require("express").Router();
const heroController = require("../../controllers/heroController");

// Matches with "/api/hero/:hero_id"
router.route("/:hero_id")
  .get(heroController.findById);

module.exports = router;
