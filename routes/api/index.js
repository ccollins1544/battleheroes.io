const router = require("express").Router();
const chatRoutes = require("./chats");
const emailRoutes = require("./sendEmail");

// All Routes matching /api/<route>
router.use("/chats", chatRoutes);
router.use("/sendemail", emailRoutes);

module.exports = router;