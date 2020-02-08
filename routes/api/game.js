const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with "/api/game/:user_id"
router.route("/:user_id")
  .post(gameController.startGame);

// Matches with "/api/game/challenge"
router.route("/challenge")
  .get(gameController.searchChallenge);

// Matches with "/api/game/:game_id"
router.route("/:game_id")
  .get(gameController.findById);

// Matches with "/api/game/pending"
router.route("/pending")
  .patch(gameController.pendingRival);

module.exports = router;
