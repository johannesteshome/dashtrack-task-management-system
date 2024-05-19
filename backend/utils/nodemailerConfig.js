const configs = require("../configs/configs");

const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: configs.emailUser,
    pass: configs.emailPass,
  },
  // host: "smtp.ethereal.email",
  port: 587,
  // auth: {
  //   user: "golda.goldner@ethereal.email",
  //   pass: "cdPWDzaVmQfDJxgKJw",
  // },
};

module.exports = nodemailerConfig;
