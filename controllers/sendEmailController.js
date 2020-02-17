const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, '../.env')});
const transporter = require("./transporter"); 
const db = require("../models");
const Firebase = require("../utils/Firebase");
var colors = require("colors");

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
   
    // res.status(200).send("Email Sent!");
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
    let message = `Hi you've been challenged by ${from_email} but you were offline. To accept/deny the challenge please log into http://BattleHeroes.io and go to the Challenge page.`;

    let gameRef = Firebase.database().ref('/games/');
    let found_rival_ref = false;
    let found_instigator_ref = false; // not using this because firebase updates dont always happen twice

    // First check to see that someone didn't already send you a challenge
    db.User.find({
      '_id': rival_id,
    },
    {
      'active_game': 1,
      'games':1
    }
    ).then(rivalResponse => {
    
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

            gameRef.once('value', (snapshot) => {
              if(snapshot.hasChildren()){
                snapshot.forEach(function(innerSnap) {
                  if(innerSnap.val().hasOwnProperty('user_id')){
        
                    if(innerSnap.val()['user_id'] === rival_id ){
                      found_rival_ref = innerSnap.key;
                    }else if (innerSnap.val()['user_id'] === instigator_id ){
                      found_instigator_ref = innerSnap.key;
                    }
        
                  }
                });
              }
            }).then(snap => {
              
              if(found_rival_ref){
                console.log("Found!".green);
                return Firebase.database().ref('/games/' + found_rival_ref + '/games').push(active_game);
              }else{
                console.log("Sorry we couldn't find that rival. They must have gone offline.".red);
                return false;
              }
        
            }).then(snap => {
              console.log("Pushed".yellow)
              console.log(snap.path);
        
              if(snap){
                console.log("Last Key Pushed".yellow, snap.key);
                console.log("Rival Key".blue, found_rival_ref);
  
                let updateTheirGame = {};
                updateTheirGame['/games/' + found_rival_ref + '/game_status'] = 1;
                updateTheirGame['/games/' + found_rival_ref + '/rival_id'] = instigator_id;
                Firebase.database().ref().update(updateTheirGame);
                
                return true;
              }else{
                return false; 
              }
              
            }).then(pass_fail => {
              console.log("Updated".yellow)
              console.log("Instigator Key".blue, found_instigator_ref);
        
              if(pass_fail){
                let updateMyGame = {};
                updateMyGame['/games/' + found_instigator_ref + '/game_status'] = 2;
                Firebase.database().ref().update(updateMyGame);
        
                console.log("Success!".green);
              }else{
                console.log("Fail!".red);

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
              }
            });

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