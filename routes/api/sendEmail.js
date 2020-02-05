const router = require("express").Router();
const sendEmailController = require("../../controllers/sendEmailController");

// Matches with "/api/sendemail/"
router.route("/")
  .post(sendEmailController.sendMessage);

module.exports = router;
