const router = require("express").Router();
const chatsController = require("../../controllers/chatsController");

// Matches with "/api/chats/:sender"
router.route("/:sender")
  .get(chatsController.findBySender)
  .post(chatsController.saveChat);

module.exports = router;
