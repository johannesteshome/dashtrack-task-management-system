const { ProjectModel } = require("../models/project.model");
const { TeamModel } = require("../models/team.model");

const create = async (data) => {
	console.log("create", data);
	return await TeamModel.create(data);
};

const findOne = async (query) => {
	return await TeamModel.findOne(query);
};

const findById = async (id) => {
	return await TeamModel.findById(id);
};

const findMany = async (query, offset, limit) => {
	return await TeamModel.find(query).skip(offset).limit(limit);
};

const update = async (id, data) => {
	return await TeamModel.findByIdAndUpdate(
		id,
		{ $set: data },
		{ new: true, runValidators: true }
	);
};

const addMembers = async (id, members) => {
	return await TeamModel.findByIdAndUpdate(
		id,
		{ $addToSet: { members: { $each: members } } },
		{ new: true, runValidators: true }
	);
};

const removeMembers = async (id, memberIds) => {
	console.log(memberIds);
	return await TeamModel.findByIdAndUpdate(
		id,
		{ $pullAll: { members: memberIds } },
		{ new: true, runValidators: true }
	);
};

const deleteOne = async (id) => {
	return await TeamModel.findByIdAndDelete(id);
};

const exists = async (query) => {
	return await TeamModel.exists(query);
};

const getTeamMembers = async (teamId) => {
	return await TeamModel.findById(teamId)
		.populate("members.member")
		.select("members");
};

const addTaskToTeam = async (teamId, taskId) => {
	return await TeamModel.findByIdAndUpdate(
		teamId,
		{ $addToSet: { tasks: taskId } },
		{ new: true, runValidators: true }
	);
};

module.exports = {
	create,
	findOne,
	findById,
	findMany,
	update,
	addMembers,
	removeMembers,
	deleteOne,
	exists,
	getTeamMembers,
	addTaskToTeam,
};
