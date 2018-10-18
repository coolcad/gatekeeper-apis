const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const config = require("../config/config");

const oauthGenerator = xoauth2.createXOAuth2Generator({
  user: config.xoauth2Options.user,
  clientId: config.xoauth2Options.clientId,
  clientSecret: config.xoauth2Options.clientSecret,
  refreshToken: config.xoauth2Options.refreshToken,
  accessToken: config.xoauth2Options.accessToken
});

oauthGenerator.on("token", token => {
  logger.info("New token for %s: %s", token.user, token.accessToken);
});

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     xoauth2: oauthGenerator
//   }
// });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.xoauth2Options.user,
    clientId: config.xoauth2Options.clientId,
    clientSecret: config.xoauth2Options.clientSecret,
    refreshToken: config.xoauth2Options.refreshToken,
    accessToken: config.xoauth2Options.accessToken
  }
});

const sendMail = (opts, cb) => {
  // mailer = require("util").promisify(transporter.sendMail);
  // return await mailer(opts);

  const mailer = transporter.sendMail(opts, err => {
    if (err) {
      logger.error(err);
    } else {
      logger.info("Email Alert sent");
    }
    cb(err);
    transporter.close();
  });
};

const createEmailOptions = options => {
  return {
    from: `GateKeeper Alerts <${process.env.ALERTS_EMAIL_ID}>`,
    to: options.receiverEmail,
    subject: options.subject,
    html: options.html
  };
};

module.exports = {
  sendMail,
  createEmailOptions
};