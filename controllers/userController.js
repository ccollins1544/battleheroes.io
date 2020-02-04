const User = require("../models/user");

// Defining methods for the userController
module.exports = {
  create: function (req, res){
    const {username, password} = req.body;

    // ADD VALIDATION
    User.findOne({
      username: username
    }, (err, user) => {
      if (err) {
        console.log('User.js post error: ', err)
      } else if (user) {
        res.json({
          error: `Sorry, already a user with the username: ${username}`
        })
      } else {
        const newUser = new User({
          username: username,
          password: password,
          user_groups: "Player",
          game_status: 0,
        })
        newUser.save((err, savedUser) => {
          if (err) return res.json(err)
          res.json(savedUser)
        })
      }
    });
  },

  getUser: function (req, res){
    console.log('===== getUser ======')
    console.log(req.user)
    if (req.user) {
      res.json({
        user: req.user
      })
    } else {
      res.json({
        user: null
      })
    }
  },

  login: (req, res) => {
    console.log('logged in', req.user);
    var userInfo = {
      _id: req.user._id,
      username: req.user.username,
      game_id: null
    };
    res.send(userInfo);
  },

  logout: function (req, res){
    if (req.user) {
      req.logout()
      res.send({
        status: 200,
        msg: 'logging out'
      })
    } else {
      res.send({
        status: 203,
        msg: 'no user to log out'
      })
    }
  },
  
  findById: (req, res) => {
    User.findOne(
      { _id: req.params.user_id }, 
      { username: 1, _id: 0 }
    )
    .then(dbModel => res.json(dbModel.username))
    .catch(err => res.status(422).json(err));
  },

};
