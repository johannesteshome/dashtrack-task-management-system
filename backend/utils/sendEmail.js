const nodemailer = require("nodemailer");
const nodemailerConfig = require("../utils/nodemailerConfig");
const configs = require("../configs/configs");

const sendEmail = async ({ email, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  const mailOptions = {
    from: "johnrobitm@gmail.com",
    to: email,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
