const { LogModel } = require("../models/Log.model");
const { UserModel } = require("../models/User.model");
const { isTokenValid } = require("../utils");
const { catchAsync } = require("../utils/asyncHandler");

const logActivity = (action) => {
	return (req, res, next) => next();
	// roles param can be a single role, or an array of roles
	return catchAsync(async (req, res, next) => {
		// console.log(req.body.email);
		if (!req.user) {
			const user = await UserModel.findOne({ email: req.body.email });
			const log = await LogModel.create({
				username: req.body.name,
				email: req.body.email,
				role: req.body.role,
				ipAddress: req.ip,
				action,
				time: new Date(),
			});
			next();
		} else {
			const log = await LogModel.create({
				username: req.user.name,
				email: req.user.email,
				userId: req.user._id,
				role: req.user.role,
				ipAddress: req.ip,
				action,
				time: new Date(),
			});
			next();
		}
	});
};

module.exports = {
	logActivity,
};
