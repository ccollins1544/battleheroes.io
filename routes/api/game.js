const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with "/api/game/:user_id
router.route("/:user_id")
  .post(gameController.startGame);

// Matches with "/api/game/challenge
router.route("/challenge")
  .post(gameController.sendChallenge)
  .get(gameController.searchChallenge);

module.exports = router;
