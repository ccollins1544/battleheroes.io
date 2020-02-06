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
    let { instigator_id, rival_id, active_game, subject, message, from_email } = req.body;

    // res.status(200).send("A OK !");

    // Send Rival Game Challenge
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