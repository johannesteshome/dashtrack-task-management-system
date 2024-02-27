const { TaskModel } = require("../models/task.model");
const taskServices = require("../services/task.services");
const teamServices = require("../services/team.services");
const { catchAsync } = require("../utils/asyncHandler");
const { isTeamMember, checkOwnership } = require("../utils/auth");
const paginatedResponse = require("./paginated.response");

const createTask = catchAsync(async (req, res) => {
	const { teamId, ...taskData } = req.body;
	taskData.createdBy = req.user._id;
	console.log(req.body);
	const team = await teamServices.findById(teamId);

	if (!team) {
		return res.status(400).json({ message: "Team not found" });
	}

	const isMember = isTeamMember(team.members, req.user._id); // for the task creator

	const isAssigneeMember = isTeamMember(team.members, taskData.assignedTo); // for the task assignee

	if (!isMember && !isAssigneeMember) {
		return res.status(403).json({
			message:
				"The task can't be created, assigner or assignee is not a member of this team",
		});
	}

	const task = await taskServices.create(taskData);
	teamServices.addTaskToTeam(teamId, task._id);

	res.status(201).json({ task });
});

const getUserTasks = catchAsync(async (req, res) => {
	const { offset, limit } = req.query;
	const query = { assignedTo: req.user._id };
	const tasks = await taskServices.findMany(
		query,
		parseInt(offset),
		parseInt(limit)
	);

	const total = await taskServices.countDocuments(query);

	res.status(200).json({
		success: true,
		data: new paginatedResponse(tasks, offset, limit, total),
	});
});

const getTask = catchAsync(async (req, res) => {
	const { id } = req.params;
	const task = await taskServices.findOne({ _id: id });

	if (!task) {
		return res.status(400).json({ message: "Task not found" });
	}

	// TODO: can any member see tasks within a team?
	const isCreator = checkOwnership(
		req.user._id.toString(),
		task.createdBy.toString()
	);

	res.status(200).json({ task });
});

const getTeamTasks = catchAsync(async (req, res) => {
	const { teamId } = req.params;
	const team = await teamServices.findById(teamId);

	if (!team) {
		return res.status(400).json({ message: "Team not found" });
	}

	const isMember = isTeamMember(team.members, req.user._id);

	if (!isMember) {
		return res
			.status(403)
			.json({ message: "You are not a member of this team" });
	}

	const tasks = await taskServices.findMany({ createdBy: teamId });

	res.status(200).json({ tasks });
});

const updateTask = catchAsync(async (req, res) => {
	const { id } = req.params;
	const task = await taskServices.findOne({ _id: id });

	if (!task) {
		return res.status(400).json({ message: "Task not found" });
	}

	const isCreator = checkOwnership(
		req.user._id.toString(),
		task.createdBy.toString()
	);

	if (!isCreator) {
		return res
			.status(403)
			.json({ message: "You are not authorized to update this task" });
	}

	const updatedTask = await taskServices.update(id, req.body);

	res.status(200).json({ task: updatedTask });
});

const deleteTask = catchAsync(async (req, res) => {
	const { id } = req.params;
	const task = await taskServices.findOne({ _id: id });

	if (!task) {
		return res.status(400).json({ message: "Task not found" });
	}

	const isCreator = checkOwnership(
		req.user._id.toString(),
		task.createdBy.toString()
	);

	if (!isCreator) {
		return res
			.status(403)
			.json({ message: "You are not authorized to delete this task" });
	}

	await taskServices.deleteOne(id);

	res.status(204).json();
});

const setReminder = catchAsync(async (req, res) => {
	console.log(req.user);
	const { id } = req.params;
	const task = await taskServices.findOne({ _id: id });

	if (!task) {
		return res.status(400).json({ message: "Task not found" });
	}

	const isAssignee = checkOwnership(req.user._id, task.assignedTo);

	if (!isAssignee) {
		return res.status(403).json({
			message: "You are not authorized to set reminder for this task",
		});
	}

	const updatedTask = await taskServices.update(
		id,
		({ reminderDate } = req.body)
	);

	res.status(200).json({ task: updatedTask });
});

const updateProgress = catchAsync(async (req, res) => {
	const { id } = req.params;
	const task = await taskServices.findOne({ _id: id });

	if (!task) {
		return res.status(400).json({ message: "Task not found" });
	}

	const isAssignee = checkOwnership(req.user._id, task.assignedTo);

	if (!isAssignee) {
		return res.status(403).json({
			message: "You are not authorized to update progress for this task",
		});
	}

	const updatedTask = await taskServices.update(id, ({ status } = req.body));

	res.status(200).json({ task: updatedTask });
});

module.exports = {
	createTask,
	updateTask,
	deleteTask,
	getUserTasks,
	getTask,
	getTeamTasks,
	setReminder,
	updateProgress,
};
