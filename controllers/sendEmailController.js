const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, '../.env')});
const transporter = require("./transporter"); 
const db = require("../models");

// Defining methods for the sendEmailController
module.exports = {
  sendMessage: function(req, res){
    let { recipient, subject, message, from_email } = req.body;

    mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: recipient,
      subject: subject, 
      text: message
    }

    if(from_email){
      mailOptions.replyTo = from_email;
    }
   
    transporter.sendMail(mailOptions, (err, data) => {
      if(err) res.status(400).json(err);
      res.status(200).send("Email Sent!");
    });
  },

  // Matches: POST /api/sendemail/challenge
  sendChallenge: function (req, res) {
    console.log("All the things", req.body)
    let { instigator_id, rival_id, active_game, from_email } = req.body;
    let subject = "New Challenge";
    let message = `You've been challenged by ${from_email}. To accept/deny the challenge please log into http://BattleHeroes.io and go to the Challenge page.`;

    // First check to see that someone didn't already send you a challenge
    db.User.find({
      '_id': rival_id,
    },
    {
      'active_game': 1,
      'games':1
    }
    ).then(rivalResponse =>{
    
      db.User.find({
        '_id': instigator_id,
        'games': rivalResponse[0].active_game
      }).then(dbModel =>{
        // Send Rival Game Challenge
        if(dbModel.length === 0){
          db.User.findOneAndUpdate(
            { '_id': rival_id },
            { 
              $push: { 'games': active_game },
              $set: { 'game_status': 1 }
            },
            { new: true }
          )
          .then( Rival => {
            console.log("Rival " + Rival);

            mailOptions = {
              from: process.env.ADMIN_EMAIL,
              to: Rival.username,
              subject: subject, 
              text: message
            }
        
            if(from_email){
              mailOptions.replyTo = from_email;
            }
          
            transporter.sendMail(mailOptions);
          })
          .catch(err => res.status(422).json(err));
        } // ELSE you have already been invited to a game by your rival
      });
    
    }).catch(err => res.status(422).json(err));

    // Update My Game Status
    db.User.findOneAndUpdate(
      { '_id': instigator_id },
      { 
        $set: { 'game_status': 2 } 
      },
      { new: true }
    )
    .then( Instigator => {
      console.log("Instigator " + Instigator);
      res.json(Instigator);
    })
    .catch(err => res.status(422).json(err));
  },

};