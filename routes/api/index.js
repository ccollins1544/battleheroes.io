const router = require("express").Router();
const chatRoutes = require("./chats");
const emailRoutes = require("./sendEmail");
const heroesRoutes = require("./heroes");
const heroRoutes = require("./hero");
const gameRoutes = require("./game");

// All Routes matching /api/<route>
router.use("/chats", chatRoutes);
router.use("/sendemail", emailRoutes);
router.use("/heroes", heroesRoutes);
router.use("/hero", heroRoutes);
router.use("/game", gameRoutes);

module.exports = router;