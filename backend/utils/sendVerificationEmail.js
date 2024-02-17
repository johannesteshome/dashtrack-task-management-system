const sendEmail = require("./sendEmail.js");

const sendVerificationEmail = async ({ name, email, token, origin, role }) => {
	const subject = "Email Verification";
	const verificationLink = `${origin}/user/auth/verify-email?token=${token}&email=${email}&role=${role}`;
	const text = `Hello ${name}. Please verify your email by clicking this link and change your password: <a href=${verificationLink}>Verify your Email</a>`;
	return await sendEmail({ email, subject, html: text });
};

module.exports = sendVerificationEmail;
