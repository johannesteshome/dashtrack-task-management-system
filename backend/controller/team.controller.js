const teamServices = require("../services/team.services");
const projectServices = require("../services/project.services");
const { catchAsync } = require("../utils/asyncHandler");
const configs = require("../configs/configs");
const {
	isProjectCreator,
	isProjectAdmin,
	isProjectMember,
	isTeamMember,
} = require("../utils/auth");
const { TeamModel } = require("../models/team.model");

const getAllTeams = catchAsync(async (req, res, next) => {
	const teams = await teamServices.findMany({});
	res.status(200).json({ teams });
});

const findOne = catchAsync(async (req, res, next) => {
	const team = await teamServices.findOne({ _id: req.params.id });
	console.log("team", team);

	if (!team) {
		return res.status(404).json({ message: "Team not found" });
	}

	// const isMember = isTeamMember(team.members, req.user._id);

	// if (!isMember) {
	// 	return res.status(403).json({ message: "Not a member of this team" });
	// }

	res.status(200).json({ team });
});

const findMany = catchAsync(async (req, res, next) => {
	const {
		page = configs.pagination.page,
		limit = configs.pagination.limit,
		...query
	} = req.query;
	const offset = (page - 1) * limit;

	const teams = await teamServices.findMany(
		{ ...query, members: { $in: [req.user._id] } },
		offset,
		limit
	);
	res.status(200).json({ teams });
});

const update = catchAsync(async (req, res, next) => {
	const { name, description } = req.body;
	const team = await teamServices.update(req.params.id, { name, description });
	res.status(200).json({ team });
});

const addMembers = catchAsync(async (req, res, next) => {
	const isExist = await teamServices.exists({ _id: req.params.id });

	if (!isExist) {
		return res.status(404).json({ message: "Team not found" });
	}

	const project = await projectServices.findProjectOfTeam(req.params.id);

	if (!project) {
		return res.status(404).json({ message: "Project not found" });
	}

	console.log("project", project, req.user);
	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectAdmin(project.users, req.user._id);

	if (!isCreator && !isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "Not authorized to add team to this project",
		});
	}

	const team = await teamServices.getTeamMembers(req.params.id);
	const membersToBeAdded = [];

	for (let member of req.body.members) {
		console.log(project.users, member);
		// TODO: better if we check if the member exists itself
		const isPMember = isProjectMember(project.users, member); // is project member
		const isTMember = isTeamMember(team.members, member); // is team member
		console.log("isPMember", isPMember, "isTMember", isTMember);

		if (isPMember && !isTMember) {
			membersToBeAdded.push(member);
		}
	}

	//TODO push notification or email to the members

	const teamAfter = await teamServices.addMembers(
		req.params.id,
		membersToBeAdded
	);

	res.status(200).json({ team: teamAfter });
});

const removeMembers = catchAsync(async (req, res, next) => {
	const team = await teamServices.findById(req.params.id);

	if (!team) {
		return res.status(404).json({ message: "Team not found" });
	}

	// TODO we can remove this if the project id can be sent from the front end
	const project = await projectServices.findProjectOfTeam(req.params.id);

	if (!project) {
		return res.status(404).json({ message: "Project not found" });
	}

	const isCreator = isProjectCreator(project.createdBy, req.user._id);
	const isAdmin = isProjectAdmin(project.users, req.user._id);
	const isMember = isTeamMember(team.members, req.user._id);
	const isItSelf = req.user._id == req.body.userId;

	if ((!isCreator && !isAdmin) || (isMember && !isItSelf)) {
		// to this operation, user must be admin or creator of the project or the team member itself
		return res.status(StatusCodes.FORBIDDEN).json({
			status: "fail",
			message: "Not authorized to add team to this project",
		});
	}

	const teamAfter = await teamServices.removeMembers(
		req.params.id,
		req.body.userId
	);
	res.status(200).json({ teamAfter });
});

const appendChat = catchAsync(async (req, res, next) => {
	const { teamId } = req.params;

	const team = await teamServices.findById(teamId);

	team.chats.push(req.body);

	await team.save();

	res.status(200).json({ chats: team.chats });
});

const getAllChat = catchAsync(async (req, res, next) => {
	const { teamId } = req.params;

	const team = await teamServices.findById(teamId);

	return res.status(200).json({ chats: team.chats });
});

module.exports = {
	findOne,
	findMany,
	getAllTeams,
	update,
	addMembers,
	removeMembers,
	getAllChat,
	appendChat,
};
