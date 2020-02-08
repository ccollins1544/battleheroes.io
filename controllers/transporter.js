const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL, 
    pass: process.env.ADMIN_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
});