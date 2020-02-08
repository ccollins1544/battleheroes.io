const router = require("express").Router();
const battleController = require("../../controllers/battleController");

// Matches with "/api/battle/accept"
router.route("/accept")
  .post(battleController.acceptGame);

// Matches with "/api/battle/accept/:game_id"
router.route("/accept/:game_id")
  .post(battleController.readyGame);

// Matches with "/api/battle/attack"
router.route("/attack")
  .patch(battleController.attackPlayer);

module.exports = router;

/*
see getGameById /api/game/:game_id
Matches with "/api/battle/progress"
router.route("/progress")
  .get(battleController.gameProgress);
*/
