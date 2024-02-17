require("dotenv").config();

module.exports = {
	dbURL: process.env.MONGODB_URL,
	jwtSecret: process.env.JWT_SECRET,
	cookieSecret: process.env.COOKIE_SECRET,
	port: process.env.PORT,
	cloudinaryURL: process.env.CLOUDINARY_URL,
	tokenExpiresIn: process.env.TOKEN_EXPIRES_IN,
	nodeEnv: process.env.NODE_ENV,
	emailUser: process.env.EMAIL_USER,
	emailPass: process.env.EMAIL_PASS,
	pagination: {
		limit: 10,
		page: 1,
	},
};
