const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, '../.env')});
const transporter = require("./transporter"); 

module.exports = {
  sendMessage: function(req, res){
    let recipient = req.body.recipient;
    let subject = req.body.subject;
    let message = req.body.message;
    let { from_email } = req.body;

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
      res.status(200).send("Email Sent");
    });
  }
};