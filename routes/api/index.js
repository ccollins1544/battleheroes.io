const router = require("express").Router();
const chatRoutes = require("./chats");
const emailRoutes = require("./sendEmail");
const heroesRoutes = require("./heroes");
const gameRoutes = require("./game");

// All Routes matching /api/<route>
router.use("/chats", chatRoutes);
router.use("/sendemail", emailRoutes);
router.use("/heroes", heroesRoutes);
router.use("/game", gameRoutes);

module.exports = router;