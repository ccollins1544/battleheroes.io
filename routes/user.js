const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('../passport');

router.post('/', (req, res) => {
  console.log('user signup');

  const {username, password} = req.body
  
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
        password: password
      })
      newUser.save((err, savedUser) => {
        if (err) return res.json(err)
        res.json(savedUser)
      })
    }
  })
})

router.post(
  '/login',
  function (req, res, next) {
    console.log('routes/user.js, login, req.body: ');
    console.log(req.body)
    next()
  },
  passport.authenticate('local'),
  (req, res) => {
    console.log('logged in', req.user);
    var userInfo = {
      _id: req.user._id,
      username: req.user.username,
      game_id: null
    };
    res.send(userInfo);
  }
)

router.get('/', (req, res, next) => {
  console.log('===== user!!======')
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
})

router.get('/:user_id', (req, res) => {
  User.findOne(
    { _id: req.params.user_id }, 
    { username: 1, _id: 0 }
  )
  .then(dbModel => res.json(dbModel.username))
  .catch(err => res.status(422).json(err));
})

router.post('/logout', (req, res) => {
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
})

module.exports = router