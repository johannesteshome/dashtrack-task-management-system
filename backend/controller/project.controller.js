const projectServices = require("../services/project.services");
const { ProjectModel } = require("../models/project.model");
const {TeamModel} = require("../models/team.model");
const userServices = require("../services/user.services");
const { catchAsync } = require("../utils/asyncHandler");
const { StatusCodes } = require("http-status-codes");
const configs = require("../configs/configs");
const paginatedResponse = require("./paginated.response");
const { sendInvitation } = require("../utils");
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

const origin = `http://localhost:3000`;

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
  const project = await projectServices.findById(id);

  if (!project) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Project not found",
    });
  }

  const isCreator = isProjectCreator(project.createdBy, req.user._id);
  const isAdmin = isProjectAdmin(project.members, req.user._id);
  console.log(req.user, project.createdBy, isCreator, isAdmin);
  if (!isCreator && !isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Not authorized to add team to this project",
    });
  }

  // validate team data, create team and add to project
  console.log({ createdBy: req.user._id, ...req.body });
  const team = await teamServices.create({
    createdBy: req.user._id,
    ...req.body,
  });

  const updatedProject = await projectServices.addTeam(id, team._id);

  res.status(StatusCodes.OK).json({
    status: "success",
    updatedProject,
    team,
  });
});

const inviteUsers = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const project = await projectServices.findById(id);

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "Project not found",
		});
	}

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectAdmin(project.members, req.user._id);

	if (!isCreator && !isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: false,
			message: "Not authorized to invite users to this project",
		});
	}

	const user = await userServices.findOne({ email: req.body.email });

	if (!user) {
		console.log("user not found");
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "User not found",
		})
	}
	else {
		// check if user is already a member
		const isMember = isProjectMember(project.members, user._id);

		if (isMember) {
			console.log("user is already a member");
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: "User is already a member",
			})
		}
		else {
			const payload = {
				user: user._id,
				email: user.email,
				project: project._id,
				permissions: USER_PERMISSIONS.WRITE
			};
			const invitationToken = createJWT({payload});
			const info = await sendInvitation({
				email: req.body.email,
				token: invitationToken,
				origin,
				project: project.name,
				id: project._id
			})

			if (!info) {
				console.log("invitation not sent");
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "Invitation not sent",
				})
			}

			console.log("invitation sent");
			return res.status(StatusCodes.OK).json({
				success: true,
				message: "Invitation sent",
			})
		}
	}

});

const acceptInviation = catchAsync(async (req, res, next) => {
	console.log(req.body);
	const { email, token, projectId } = req.body;

	const decoded = isTokenValid(token);

	console.log("decoded", decoded);

	if (email !== decoded.email) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "token tempered",
		});
	}

	const user = await userServices.findOne({ email });

	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "User with the provided email not found",
		});
	}

	// if (!checkOwnership(req.user._id, user._id)) {
	// 	return res.status(StatusCodes.UNAUTHORIZED).json({
	// 		status: "fail",
	// 		message: "Not authorized to this invitation",
	// 	});
	// }

	const project = await projectServices.findOne({
		_id: projectId,
	});

	if (!project) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "Project not found",
		});
	}

	const userData = {
		user: user._id,
		permissions: decoded.permissions,
	};

	console.log(userData);

	// add user to project
	const updatedProject = await projectServices.acceptInviation(
		projectId,
		userData
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: 'Invitation accepted successfully',
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
