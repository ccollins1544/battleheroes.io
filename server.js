/**
 * @package battleheroes.io
 * @subpackage server
 * @author Tyler Webb, Christopher Collins, Matthew Ayrton, Daniel Osornio
 * @version 2.0.0
 */
/* ===============[ Dependencies  ]========================*/
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const dbConnection = require("./models/db.js"); // Connects to db
const MongoStore = require('connect-mongo')(session)
const passport = require("./passport");
const PORT = process.env.PORT || 3001;
const app = express();

/* ===============[ Express Config ]=======================*/
// Use Features
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from the "build" directory.
if (process.env.NODE_ENV === "production"){
  app.use(express.static(path.resolve(__dirname,'react-client/build')));
}

/* ===============[ Passport Session ]====================*/
// We need to use sessions to keep track of our user's login status
app.use(
  session({ 
    secret: "showmethemoney", 
    store: new MongoStore({ mongooseConnection: dbConnection }),
    resave: false, 
    saveUninitialized: false 
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* ===============[ SOCKET.IO Config ]====================*/
const socket_server = require("./socket_io")(app);
const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
const HOST = process.env.HOST || "localhost"
const socket_url = `http://${HOST}:${SOCKET_PORT}/`

/* ===============[ Add routes, both API and view ]========*/
const cors = require('cors');
const routes = require("./routes");
app.use(cors());
app.use(routes);

// Start the API server
app.listen(PORT, function(){
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

// Start the SOCKET server
socket_server.listen(SOCKET_PORT, () => {
  console.log(`🌎  ==> Socket Server is running on ${socket_url}`);
});