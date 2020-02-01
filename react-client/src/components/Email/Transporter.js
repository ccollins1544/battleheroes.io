require("dotenv").config();

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

let adminMailer = {
  from: "admin@battleheroes.io",
  to: "Osornioana@aol.com",
  subject: "testing",
  text: "lets play"
};

transporter.sendMail(adminMailer, function(err, data) {
  if (err) {
    console.log("error");
  } else {
    console.log("email sent");
  }
});

module.exports = {
  transporter,
  adminMailer
};
