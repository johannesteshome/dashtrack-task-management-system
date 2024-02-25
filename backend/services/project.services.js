const { ProjectModel } = require("../models/project.model");
const mongoose = require("mongoose");

const create = async (data) => {
	return await ProjectModel.create(data);
};

const findOne = async (query) => {
	return await ProjectModel.findOne(query);
};

const findById = async (id) => {
	return await ProjectModel.findById(id);
};

const findMany = async (query, offset, limit) => {
	return await ProjectModel.find(query).skip(offset).limit(limit);
};

const update = async (id, data) => {
	return await ProjectModel.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
			runValidators: true,
		}
	);
};

const addTeam = async (id, team) => {
	return await ProjectModel.findByIdAndUpdate(
		id,
		{ $addToSet: { teams: team } },
		{
			new: true,
			runValidators: true,
		}
	);
};

const removeTeam = async (id, teamId) => {
	const project = await ProjectModel.findById(id);
	project.removeTeam(teamId);
	return project;
};

const addUsers = async (id, userList) => {
	return await ProjectModel.findByIdAndUpdate(
		id,
		{ $push: { users: { $each: userList } } },
		{
			new: true,
			runValidators: true,
		}
	);
};

const removeUser = async (id, userId) => {
	return await ProjectModel.findByIdAndUpdate(
		id,
		{ $pull: { users: { user: userId } } },
		{
			new: true,
			runValidators: true,
		}
	);
};

const deleteOne = async (id) => {
	return await ProjectModel.findByIdAndDelete(id);
};

const exists = async (query) => {
	return await ProjectModel.exists(query);
};

const projetUsers = async (id) => {
	return await ProjectModel.findById(id).populate("users.user").select("users");
};

const projectTeams = async (id) => {
	return await ProjectModel.findById(id).populate("teams").select("teams");
};

const findProjectOfTeam = async (id) => {
	// TODO
	return await ProjectModel.findOne({ teams: { $in: [id] } });
};

const acceptInviation = async (id, userData) => {
	return await ProjectModel.findOneAndUpdate(
		{ _id: id },
		{ $push: { users: userData } },
		{
			new: true,
			runValidators: true,
		}
	);
};

module.exports = {
	create,
	findOne,
	findById,
	findMany,
	update,
	deleteOne,
	exists,
	addTeam,
	removeTeam,
	addUsers,
	removeUser,
	projetUsers,
	projectTeams,
	acceptInviation,
	findProjectOfTeam,
};
