const router = require("express").Router();
const chatRoutes = require("./chats");

// All Routes matching /api/<route>
router.use("/chats", chatRoutes);

module.exports = router;
