const router = require("express").Router();
const sendEmailController = require("../../controllers/sendEmailController");
// const gameController = require("../../controllers/gameController");

// Matches with "/api/sendemail/"
router.route("/")
.post(sendEmailController.sendMessage);

// Matches with "/api/sendemail/challenge"
router.route("/challenge")
  .post(sendEmailController.sendChallenge)

module.exports = router;
