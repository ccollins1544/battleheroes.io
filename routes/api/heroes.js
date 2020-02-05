const router = require("express").Router();
const heroesController = require("../../controllers/heroesController");

// Matches with "/api/heroes"
router.route("/")
  .get(heroesController.findAll);

// Matches with "/api/heroes/:slug"
router.route("/:slug")
.get(heroesController.findBySlug);

module.exports = router;
