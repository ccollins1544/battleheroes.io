const router = require("express").Router();
const passport = require('../passport');
const userController = require("../controllers/userController");

// Matches with "/user"
router.route("/")
  .post(userController.create)
  .get(userController.getUser);

// Matches with "/user/login" 
router.route("/login").post(
  function (req, res, next) {
    console.log('routes/user.js, login, req.body: ');
    console.log(req.body)
    next()
  },
  passport.authenticate('local'),
  userController.login
);

// Matches with "/user/logout"
router.route("/logout")
  .post(userController.logout);

// Matches with "/user/:user_id"
router.route("/:user_id")
  .patch(userController.findById);

module.exports = router