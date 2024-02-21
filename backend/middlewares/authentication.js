const { isTokenValid, attachCookiesToResponse } = require("../utils/jwt");
const { TokenModel } = require("../models/Token.model");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");

const authenticateUser = async (req, res, next) => {
	let { refreshToken, accessToken } = req.signedCookies;
	const authHeader = req.headers.authorization;
	console.log(req.headers);
	console.log(req.signedCookies);
	accessToken = accessToken ?? authHeader?.split(" ")[1];
	console.log(accessToken, refreshToken);
	try {
		if (accessToken) {
			const payload = isTokenValid(accessToken);
			req.user = payload.user;
			return next();
		}

		const payload = isTokenValid(refreshToken);

		const userId = new ObjectId(payload.user._id);
		const existingToken = await TokenModel.findOne({
			user: userId,
			refreshToken: payload.refreshToken,
		});

		if (!existingToken || !existingToken?.isValid) {
			throw new Error("Invalid token or session expired");
		}

		attachCookiesToResponse({
			res,
			user: payload.user,
			refreshToken: existingToken.refreshToken,
		});
		req.user = payload.user;
		next();
	} catch (error) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: "Authentication Invalid! No logged in session" });
	}
};

const authorizePermissions = (...roles) => {
	// roles param can be a single role, or an array of roles
	return (req, res, next) => {
		if (!roles.includes(req.user.role.toLowerCase())) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: "Unauthorized to access this route" });
		}
		next();
	};
};

module.exports = {
	authenticateUser,
	authorizePermissions,
};
