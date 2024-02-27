const userServices = require("../services/user.services");
const { catchAsync } = require("../utils/asyncHandler");
const configs = require("../configs/configs");
const { USER_ROLES } = require("../constants/constants");
const paginatedResponse = require("./paginated.response");

const getAllUsers = catchAsync(async (req, res, next) => {
	console.log(req.query);

	const { page: defaultPage, limit: defaultLimit } = configs.pagination;
	const { page = defaultPage, limit = defaultLimit } = req.query;
	const offset = (page - 1) * limit;

	const users = await userServices.findMany({}, offset, limit);

	res.status(200).json({
		success: true,
		response: new paginatedResponse(users, page, limit, users.length),
	});
});

const fileterUsers = catchAsync(async (req, res, next) => {
	const { page: defaultPage, limit: defaultLimit } = configs.pagination;
	const { page = defaultPage, limit = defaultLimit } = req.query;
	const offset = (page - 1) * limit;

	const { name, email, gender } = req.query;
	const filter = {};

	if (name) {
		filter.name = name;
	}

	if (email) {
		filter.email = email;
	}

	if (gender) {
		filter.gender = gender;
	}

	const users = await userServices.findMany(filter, offset, limit);
	res.status(200).json({
		success: true,
		result: new paginatedResponse(users, page, limit, users.length),
	});
});

const getUser = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const user = await userServices.findById(id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	const isAdmin = req.user.role === USER_ROLES.ADMIN;
	const isOwner = req.user._id === id;

	if (!isAdmin && !isOwner) {
		return res.status(403).json({
			success: false,
			message: "You are not authorized to perform this operation",
		});
	}

	user.password = undefined;

	res.status(200).json({
		success: true,
		user,
	});
});

const updateUser = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const isOwner = req.user._id === id;

	if (!isOwner) {
		return res.status(403).json({
			success: false,
			message: "You are not authorized to perform this operation",
		});
	}

	const user = await userServices.findOne({ _id: id });

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	// to prevent password update here as it is handled in another routeS
	req.body.password = undefined;

	const updatedUser = await userServices.update(id, req.body);
	updatedUser.password = undefined;
	res.status(200).json({
		success: true,
		user: updatedUser,
	});
});

const deleteUser = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const user = await userServices.findById(id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	const isAdmin = req.user.role === USER_ROLES.ADMIN;
	const isOwner = req.user._id === id;

	if (!isAdmin && !isOwner) {
		return res.status(403).json({
			success: false,
			message: "You are not authorized to perform this operation",
		});
	}

	await userServices.deleteOne({ _id: id });
	res.status(200).json({
		success: true,
		message: "User deleted successfully",
	});
});

module.exports = {
	getAllUsers,
	fileterUsers,
	getUser,
	updateUser,
	deleteUser,
};
