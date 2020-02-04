const router = require("express").Router();
const chatRoutes = require("./chats");
const emailRoutes = require("./sendEmail");
const heroesRoutes = require("./heroes");

// All Routes matching /api/<route>
router.use("/chats", chatRoutes);
router.use("/sendemail", emailRoutes);
router.use("/heroes", heroesRoutes);

module.exports = router;