const projectServices = require("../services/project.services");
const {ProjectModel} = require("../models/project.model");
const userServices = require("../services/user.services");
const { catchAsync } = require("../utils/asyncHandler");
const { StatusCodes } = require("http-status-codes");
const configs = require("../configs/configs");
const paginatedResponse = require("./paginated.response");
const {
	isProjectCreator,
	isProjectMember,
	isProjectAdmin,
	checkOwnership,
	encrypt,
} = require("../utils/auth");
const sendEmail = require("../utils/sendEmail");
const { createJWT, isTokenValid } = require("../utils/jwt");
const {USER_PERMISSIONS} = require("../constants/constants");

const create = catchAsync(async (req, res, next) => {
	req.body.createdBy = req.user._id;
	console.log(req.user._id, 'user created');
	const data = { ...req.body, members: [{user: req.user._id, permissions: USER_PERMISSIONS.WRITE}] }

	const project = await projectServices.create(data);
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: 'Project created successfully',
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
	let project = await projectServices.findOne({
		_id: id,
	});

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "Project not found",
		});
	}

	console.log(req.user);

	// checking ownership
	const isMember = isProjectMember(project.members, req.user._id); //TODO if the users.user is populated the check will fail
	const isCreator = isProjectCreator(project.createdBy, req.user._id);

	console.log(isMember, isCreator);

	if (!isMember && !isCreator) {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: false,
			meassage: "Not authorized to this project",
		});
	}

	project = await ProjectModel.findById(id)
    .populate("members.user", 'name email')
    .populate("teams");

	res.status(StatusCodes.OK).json({
		success: true,
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
	console.log(project, 'project');

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "Project not found",
		});
	}

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectMember(project.members, req.user._id);

	if (!isCreator && !isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: false,
			message: "Not authorized to delete this project",
		});
	}

	await projectServices.deleteOne(id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Project deleted successfully",
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

	const emails = [];

	// cases
	// 1) not found
	// 2) not verified
	// 3) verified

	for (let userData of req.body.users) {
		const user = await userServices.findOne({ email: userData.email });
		var payload = { userData };
		var token;
		if (!user) {
			// register the user
			// validate user data
			payload.changePass = true;
			token = createJWT({ payload });
			await userServices.create({
				name: "default",
				email: userData.email,
				verificationToken: token,
				password: "password",
			});
		} else {
			// check if user is already a member
			const isMember = isProjectMember(project.users, user._id);

			if (isMember) {
				console.log("user is already a member", userData.user);
				continue;
			}
		}

		console.log(userData);
		const email = {
			email: userData.email,
			subject: req.user.name + " invited you to " + project.name + " project",
			html: `http://localhost:${configs.port}/project/acceptInvitation?projectId=${project._id}&token=${token}&email=${userData.email}`,
		};

		emails.push(email);

		// send push notification to user or email
	}

	// send email to users

	// send email to users
	for (let email of emails) {
		// send email
		sendEmail(email);
	}

	res.status(StatusCodes.OK).json({
		status: "success",
	});
});

const acceptInviation = catchAsync(async (req, res, next) => {
	const { email, token, projectId } = req.query;

	const decoded = isTokenValid(token);

	console.log("decoded", decoded);

	if (email !== decoded.userData.email) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			status: "fail",
			message: "token tempered",
		});
	}

	const user = await userServices.findOne({ email });

	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "User with the provided email not found",
		});
	}

	if (!checkOwnership(req.user._id, user._id)) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: "fail",
			message: "Not authorized to this invitation",
		});
	}

	const project = await projectServices.findOne({
		_id: projectId,
	});

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Project not found",
		});
	}

	const userData = {
		user: user._id,
		permissions: decoded.userData.permissions,
	};

	console.log(userData);

	// add user to project
	const updatedProject = await projectServices.acceptInviation(
		projectId,
		userData
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

	// creator can only remove other users
	const isCreator = isProjectCreator(project.createdBy, req.user._id);

	// admin can remove any user including itself
	const isAdmin = isProjectAdmin(project.users, req.user._id);

	// member can remove itself only
	const isItSelf = checkOwnership(req.user._id, req.user.userId);
	console.log(isCreator, isMember, isOwner);

	if (isCreator && isItSelf) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "As a creator, you can't remove yourself from the project",
		});
	}

	if (!isAdmin && !isItSelf && !isCreator) {
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
