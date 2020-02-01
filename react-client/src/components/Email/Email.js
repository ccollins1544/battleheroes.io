const email = async (transport, { to, from, html, subject }) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ to, from, html, subject }, (error, info) =>
      error ? reject(error) : resolve(info)
    );
  });
};

module.exports = {
  email
};
