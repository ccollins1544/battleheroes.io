const router = require("express").Router();
const chatRoutes = require("./chats");
const emailRoutes = require("./sendEmail");
const heroesRoutes = require("./heroes");
const heroRoutes = require("./hero");
const gameRoutes = require("./game");
const battleRoutes = require("./battle");

// All Routes matching /api/<route>
router.use("/chats", chatRoutes);
router.use("/sendemail", emailRoutes);
router.use("/heroes", heroesRoutes);
router.use("/hero", heroRoutes);
router.use("/game", gameRoutes);
router.use("/battle", battleRoutes);

module.exports = router;