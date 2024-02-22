const nodemailer = require("nodemailer");
const nodemailerConfig = require("../utils/nodemailerConfig");
const configs = require("../configs/configs");

const sendEmail = async ({ email, subject, html }) => {
	let transporter = await nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: configs.emailUser,
			pass: configs.emailPass,
		},
	});

	const mailOptions = {
		from: configs.emailUser,
		to: email,
		subject,
		html,
	};

	console.log(mailOptions);

	return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
