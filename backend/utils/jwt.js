const jwt = require("jsonwebtoken");
const configs = require("../configs/configs");

const createJWT = ({ payload }) => {
	console.log(configs.jwtSecret);
	const token = jwt.sign(payload, configs.jwtSecret, {
		expiresIn: configs.tokenExpiresIn,
	});
	return token;
};

const isTokenValid = (token) => jwt.verify(token, configs.jwtSecret);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
	const accessTokenJWT = createJWT({ payload: { user } });
	const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie("refreshToken", refreshTokenJWT, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: configs.nodeEnv === "production",
		signed: true,
	});
	res.cookie("accessToken", accessTokenJWT, {
		httpOnly: true,
		secure: configs.nodeEnv === "production",
		signed: true,
		maxAge: 1000 * 60 * 15,
	});

	return { accessTokenJWT, refreshTokenJWT };
};

module.exports = {
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
};
