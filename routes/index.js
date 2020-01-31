const path = require("path");
const router = require("express").Router();
const api_routes = require("./api");
const user_routes = require("./user");

// API Routes
router.use("/api", api_routes);
router.use("/user", user_routes);

// If no API routes are hit, send the React app
router.use(function(req, res){
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
