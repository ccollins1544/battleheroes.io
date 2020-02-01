import React from "react";

const nodemailer = require("nodemailer");

const Transport = () => {
  let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e259aca53a3db6",
      pass: "964068e6fc449b"
    }
  });
};

module.exports = {
  Transport
};
