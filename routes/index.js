const path = require("path");
const router = require("express").Router();
const api_routes = require("./api");

// API Routes
router.use("/api", api_routes);

// If no API routes are hit, send the React app
router.use(function(req, res){
  res.sendFile(path.join(__dirname, "../react-client/build/index.html"));
});

module.exports = router;