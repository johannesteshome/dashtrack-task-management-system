const projectServices = require("../services/project.services");
const userServices = require("../services/user.services");
const { catchAsync } = require("../utils/asyncHandler");
const { StatusCodes } = require("http-status-codes");
const configs = require("../configs/configs");
const paginatedResponse = require("./paginated.response");
const {
	isProjectCreator,
	isProjectMember,
	isProjectAdmin,
} = require("../utils/auth");
const { sendEmail } = require("../utils");

const create = catchAsync(async (req, res, next) => {
	req.body.createdBy = req.user._id;

	const project = await projectServices.create(req.body);
	res.status(StatusCodes.CREATED).json({
		status: "success",
		project,
	});
});

const getAll = catchAsync(async (req, res, next) => {
	const { limit = configs.pagination.limit, page = configs.pagination.page } =
		req.query;
	const offset = (page - 1) * limit;

	const projects = await projectServices.findMany({}, offset, limit);
	res.status(StatusCodes.OK).json({
		status: "success",
		result: new paginatedResponse(projects, page, limit, projects.length),
	});
});
// with filteration too
const getMyProjects = catchAsync(async (req, res, next) => {
	const { limit = configs.pagination.limit, page = configs.pagination.page } =
		req.query;
	const offset = (page - 1) * limit;

	// get all projects where user is a member
	const query = {
		$or: [
			{ users: { $elemMatch: { user: req.user._id } } },
			{ createdBy: req.user._id },
		],
		...req.query,
	};

	const projects = await projectServices.findMany(query, offset, limit);
	res.status(StatusCodes.OK).json({
		status: "success",
		result: new paginatedResponse(projects, page, limit, projects.length),
	});
});

const getProject = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.findOne({
		_id: id,
	});

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	console.log(req.user);

	// checking ownership
	const isMember = isProjectMember(project.users, req.user._id); //TODO if the users.user is populated the check will fail
	const isCreator = isProjectCreator(project.createdBy, req.user._id);

	console.log(isMember, isCreator);

	if (!isMember && !isCreator) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			meassage: "Not authorized to this project",
		});
	}

	res.status(StatusCodes.OK).json({
		status: "success",
		project,
	});
});

const updateProject = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.findById(id);

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	console.log(req.user, project.createdBy);

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectMember(project.users, req.user._id);

	console.log(isCreator, isAdmin);
	if (!isCreator && !isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "Not authorized to update this project",
		});
	}

	// remove unallowed fields to update
	req.body.createdBy = undefined;
	req.body.users = undefined;
	req.body.teams = undefined;

	const updatedProject = await projectServices.update(id, req.body);

	res.status(StatusCodes.OK).json({
		status: "success",
		updatedProject,
	});
});

const deleteProject = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.findById(id);

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectMember(project.users, req.user._id);

	if (!isCreator && !isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "Not authorized to delete this project",
		});
	}

	await projectServices.deleteOne(id);

	res.status(StatusCodes.NO_CONTENT).json({
		status: "success",
	});
});

const addTeam = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.exists({ id });

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	// create team and add to project

	const updatedProject = await projectServices.addTeam(id, req.body.team);

	res.status(StatusCodes.OK).json({
		status: "success",
		updatedProject,
	});
});

const inviteUsers = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.findById(id);

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectAdmin(project.users, req.user._id);

	if (!isCreator && !isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "Not authorized to invite users to this project",
		});
	}

	// itereate over users and send invite

	const userToBeInvited = [];
	const emails = [];

	for (let userData of req.body.users) {
		const user = await userServices.findOne({ email: userData.email });
		var email;
		if (!user) {
			// send invitation email to signup
			userToBeInvited.push(userData);
			email = { to: userData.email, subject: "", html: "" };
			emails.push(user.email);
			continue;
		}

		// check if user is already a member
		const isMember = isProjectMember(project.users, userData.user);

		if (isMember) {
			console.log("user is already a member", userData.user);
			continue;
		}

		email = {
			to: userData.email,
			subject: req.user.name + " invited you to " + project.name + " project",
			html: `http://localhost:${configs.port}/project/${project._id}/acceptInviation`,
		};
		userToBeInvited.push(userData);
		emails.push(user.email);

		// send push notification to user or email
	}

	// add user to project
	const updatedProject = await projectServices.addUsers(id, userToBeInvited);

	// send email to users

	// send email to users
	// for (let email of emails) {
	// 	// send email
	// 	sendEmail(email);
	// }

	res.status(StatusCodes.OK).json({
		status: "success",
		updatedProject,
	});
});

const acceptInviation = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.findOne({
		_id: id,
		users: {
			$elemMatch: { user: req.user._id, isInvitationAccepted: false },
		},
	});

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	// add user to project
	const updatedProject = await projectServices.acceptInviation(
		id,
		req.body.userId
	);

	res.status(StatusCodes.OK).json({
		status: "success",
		updatedProject,
	});
});

const removeUser = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const project = await projectServices.findOne({
		_id: id,
		users: {
			$elemMatch: { user: req.body.userId },
		},
	});

	console.log(req.user);

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isMember = isProjectMember(project.users, req.user._id);
	const isOwner = isProjectMember(project.users, req.user._id);
	console.log(isCreator, isMember, isOwner);

	if (isCreator) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "you can't remove yourself from the project",
		});
	}

	if (!isMember && !isOwner) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "Not authorized to remove users from this project",
		});
	}

	// remove user from project
	const updatedProject = await projectServices.removeUser(id, req.body.userId);

	res.status(StatusCodes.OK).json({
		status: "success",
		updatedProject,
	});
});

module.exports = {
	create,
	getAll,
	getProject,
	getMyProjects,
	updateProject,
	deleteProject,
	addTeam,
	inviteUsers,
	acceptInviation,
	removeUser,
};
